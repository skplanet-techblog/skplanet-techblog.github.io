---
title: "Chat DIC 프로젝트에서 AWS Bedrock Prompt Caching으로 성능 최적화하기"
date: "2025-10-17"
tags: ["AI", "Prompt Caching", "Chat DIC", "SQL Generation", "Optimization", "AWS", "Bedrock"]
author: "rhs"
description: "사내 Chat DIC 프로젝트에서 AWS Bedrock을 이용해 DB 스키마 기반 쿼리 생성 서비스를 구현하며, Prompt Caching을 적용해 토큰 사용량과 응답 지연을 줄인 실제 사례를 소개합니다."
---

이 글은 SK플래닛 사내 AI 프로젝트 **Chat DIC**에서 AWS Bedrock의 Prompt Caching 기능을 활용해 **쿼리 생성 속도와 비용을 최적화한 사례**를 다룹니다.

# 1. 개요

Chat DIC는 사용자의 자연어 요청을 기반으로 사내 DB 스키마 정보를 Bedrock 모델에 전달해

- 원하는 **SQL 쿼리를 생성하거나**,
- 관련된 **테이블과 필드를 탐색**할 수 있도록 도와주는 시스템입니다.

하지만 이 과정에서 매번 전체 스키마 정보를 Prompt에 포함시키다 보니,
토큰 수가 급격히 증가하고 **Throttling** 및 **응답 지연** 문제가 발생했습니다.
이 문제를 해결하기 위해 Bedrock의 **Prompt Caching** 기능을 도입했습니다.

---

# 2. Prompt Caching이란?

Prompt Caching은 반복적으로 사용되는 프롬프트 문맥(예: system, tools 등)을 캐시에 저장하여
**모델 재계산을 줄이고**, **응답 지연 시간과 토큰 비용을 절감**할 수 있는 Bedrock의 기능입니다.

### 주요 효과

- **지연 시간 단축:** Cache된 문맥은 매번 재연산할 필요가 없어 빠른 응답 가능
- **토큰 비용 절감:** Cache에서 읽은 토큰은 낮은 요율이 적용되어 비용 절감
- **효율적 자원 활용:** 불필요한 재요청 및 Throttling을 줄여 안정적인 API 사용 가능

### Chat DIC 적용 이유

Chat DIC은 **DB 스키마 정보(system + tools prompt)** 가 매우 크기 때문에
모델이 매번 이를 다시 처리하는 비효율이 존재했습니다.  
이를 Prompt Caching을 통해 상시 유지함으로써, **message prompt의 변경된 부분만 계산**하도록 최적화했습니다.

---

# 3. 작동 원리

### Cache Checkpoint

- 캐시 저장 지점으로, prompt prefix(연속된 문맥 블록)를 지정
- Claude 3.7+ 기준 최소 1,024 tokens 필요 (Chat DIC는 Claude 4 사용, 4.5는 A/B Testing 중)
- 예: 1,800 tokens에서 cachepoint 지정 시, 이후 cachepoint 지정은 2,048 tokens 도달 시 가능

### TTL (Time To Live)

- 캐시 유효 기간은 **5분**
- TTL 내 캐시 히트 발생 시, TTL은 자동으로 재설정됨

### 지원 API

- Converse / ConverseStream
- InvokeModel / InvokeModelWithResponseStream
- Cross-region Inference 기능과 조합 가능

### Prompt 관리

- Console 및 API에서 프롬프트 생성·수정 시 캐싱 옵션 설정 가능
- `system`, `messages`, `tools` 등의 필드에 적용 가능
- 체크포인트 추가 시 모델별 최대 제한 존재

---

# 4. Chat DIC 시스템 구조 및 이슈

### (1) 초기 구조: AWS Gateway + Lambda

Bedrock API를 Lambda로 호출 <br/><br/>
주요 이슈:
- Gateway Timeout 29초 → 90초 확장해도 불충분
- SSE 통신 미지원 (`stream` 옵션 불가)
- Throttling 빈번히 발생
- Lambda 환경에서 Prompt Caching 미지원

=> 결과적으로 이 구조는 테스트용으로만 유지

### (2) 개선 구조: AWS ALB + EC2

- SSE 통신 지원 (`stream=True` 정상 작동)
- Timeout 3600초까지 설정 가능 (기본 600초 사용)
- 여전히 Throttling 이슈가 간헐적으로 발생

### (3) Prompt Caching 도입

- `system`과 `tools` 프롬프트에 캐시 적용
- `messages` 영역은 사용자 입력이 매번 달라 적용 효율이 낮음
- CachePoint 한도 초과 방지를 위해 선택적으로 사용

---

# 5. 적용 코드 예시

### 🧩 System Prompt Caching

```python
system_prompts = []  
for message in chat_request.messages:  
    if message.role != "system":  
        # ignore system messages here  
  continue  
 assert isinstance(message.content, str)  
    system_prompts.append({"text": message.content})  

# Prompt Caching
if system_prompts:  
    system_prompts.append({"cachePoint": {"type": "default"}})  
  
return system_prompts
```

### 🧰 Tools Prompt Caching

```python
# add tool config  
if chat_request.tools:  
    tool_list = [self._convert_tool_spec(t.function) for t in chat_request.tools]
    tool_list.append({"cachePoint": {"type": "default"}}) # Prompt Caching
    tool_config = {"tools": tool_list}
```

---

# 6. Cache Hit 구조 (Chat DIC에서의 적용 결과)

| 구분 | 조건 | 설명 |
|------|------|------|
| **Cache Miss** | 누적 토큰 수 < 1,024 OR 프롬프트 prefix 불일치 OR TTL(5분) 초과 | 모델 재연산 발생 |
| **Cache Hit** | 누적 토큰 수 ≥ 1,024 AND 프롬프트 prefix 완전 일치 AND TTL(5분) 내 유효 | system, tools tokens 계산 절감 |

### 실제 효과

- 캐시 도입 전 평균 응답 시간: **~29.3초**
- 캐시 도입 후 평균 응답 시간: **~23.1초**
- Throttling 발생률: **약 60% 감소**
- 시스템 리소스 부하 및 비용 절감 효과 확인

---

## 7. 마치며

Prompt Caching은 단순히 모델 호출 속도를 개선하는 기술이 아니라,
**LLM 기반 시스템의 구조적 효율을 향상시키는 핵심 기능**입니다.

Chat DIC 프로젝트의 경우,

- 방대한 DB 스키마 정보를 캐싱하여 재사용함으로써 **불필요한 토큰 소모를 줄이고**,
- **SSE 스트리밍 환경에서도 안정적으로 작동**하는 시스템을 구축할 수 있었습니다.

향후에는 캐시 TTL 및 캐시 영역을 세분화하여
사용자 맞춤형 Prompt 재활용 로직을 도입할 계획입니다.

---

## 8. 참고 링크

- 🔗 [AWS 공식 문서: Prompt Caching](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)
- 📘 SK Planet TechTopic: [https://techtopic.skplanet.com/skp-techblog-intro/](https://techtopic.skplanet.com/skp-techblog-intro/)

