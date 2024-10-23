---
title: "Spark Streaming을 활용한 파생 데이터 생성 시간 감축 사례"
date: "2024-10-23"
tags: ["BigData", "Spark Streaming", "Kafka", "Hive"]
author: "junghochoi"
description: "Hadoop 기반 빅 데이터 시스템의 정보를 토대로 인사이트를 발견할 때 배치로 스케줄링 해 파생 데이터를 생성합니다. 하지만 파생 데이터가 지연 생성될 수 있는데 이를 개선하고자 spark streaming을 사용하여 실시간으로 전환한 사례를 소개합니다."
---

SK플래닛의 Hadoop 기반 Data Integration Cluster(이하 DIC)는 서비스의 다양한 데이터를 수집하고 분석하는 데 사용합니다. 데이터의 분석을 수행할 때는 새로운 정보나 인사이트를 위해 다른 테이블과의 조인 및 변환을 통해 파생 데이터를 생성하며, 파생 데이터를 생성하는 여러 방법 중 Hive Query 형태로 로직을 만들고 Oozie, Airflow를 통해 스케줄을 관리하는 형태가 가장 많이 사용되고 있습니다.

![[그림 1] 파생 데이터 생성 과정](./batch_table.png)
[그림 1] 파생 데이터 생성 과정

하지만, 이 방법의 단점은 변환하려는 Hive 테이블의 데이터가 더 추가되지 않는 완전한 상태여야 합니다. 그래서 날짜 단위로 파티션이 나누어진 Hive 테이블은 데이터가 추가되지 않는 +1일 이후에 파생 데이터를 생성합니다. 자정이 넘은 새벽 시간에 파생 데이터 생성 작업을 하는 주요 이유이기도 합니다.

+1일 이후에 파생 데이터가 생성된다는 것은 분석할 데이터가 늦어지는 것이므로 새로운 인사이트를 얻거나 고객에게 제공할 새로운 서비스도 지연됨을 의미합니다. 위와 같은 고민으로 데이터를 수집하는 동시에 파생 데이터도 생성하는 방법에 대해서 고민하게 되었습니다.
</br>

## SPaaS(Streaming Platform as a Service)
파생 데이터 생성시간 단축의 핵심은 ‘데이터의 실시간 처리’입니다. DIC로 유입되는 많은 실시간 데이터의 변환과 적재를 효율적으로 관리하는 시스템의 필요성을 느끼게 되었는데요. 'Streaming Platform as as Service'를 지향하는 서비스로서 몇 가지의 목표를 세우게 되었습니다.

1. 가상의 그래프 형태로 데이터의 흐름을 표현하며 데이터 파이프라인의 설정을 UI로 손쉽게 시각화한다.
2. 배치 작업에서 사용하던 Hive Query를 재사용할 수 있게 한다.
3. 데이터 파이프라인 별로 필요한 만큼 리소스를 조정한다.
4. 다양한 저장소로 적재하는 기능을 갖는다.
5. 데이터 파이프라인의 모니터링 및 이상 유무를 감지한다.

> 참고) 데이터 파이프라인: 데이터의 수집, 변환, 저장, 분석을 수행하는 데이터의 처리 과정으로 정의합니다.

위와 같은 특징을 가진 'Router'라는 서비스를 개발하였습니다.

### Router
[그림 2]는 Router에서 데이터 파이프라인을 설정한 화면입니다.

Router의 데이터 파이프라인은 2개의 vertex를 하나의 edge로 연결한 'directed graph' 형태로 표현합니다. vertex는 데이터가 존재하는 저장소를, edge는 저장소의 데이터 변환을 의미합니다. 2개의 vertex는 위치에 따라 'source vertex'와 'target vertex'로 명칭하는데,  source vertex는 원본 데이터, target vertex는 edge에 의해 변환된 데이터에 해당됩니다. 데이터가 계속 흘러간다는 의미로 '스트리밍 데이터'라는 표현을 많이 쓰는데요, Router는 edge들을 연속적으로 연결해서 이 스트리밍 데이터의 흐름을 쉽게 파악할 수 있습니다.

![[그림 2] Router 데이터 파이프라인](./router_ui.png)
[그림 2] Router 데이터 파이프라인

Router의 가진 기능을 크게 2가지고 분류하고 기능을 확장하는 형태로 구현되었습니다. 데이터를 저장하는 기능은 Connect, 변환은 Processor로 명칭하고 각각 Kafka Connect와 Spark을 사용했습니다.

* Connect
  * Kafka Connect 기반으로 다양한 저장소로 데이터 기록
* Processor
  * Stream-Processor
    * Spark Streaming을 통한 Kafka 데이터의 변환
  * Hive-Processor
    * Hive 테이블의 데이터를 주기적으로 Kafka로 전송

본 글은 Hive 배치로 작업하던 방식을 Spark Streaming을 통해 실시간으로 변경 작업을 하는 Stream-Processor를 중심으로 설명하겠습니다.  
</br>

## Stream-Processor를 통한 실시간 데이터 변환
DIC로 들어오는 데이터는 1차적으로 Kafka로 모입니다. Kafka는 분산 아키텍처로 대규모의 데이터를 효율적으로 처리하며 확장성을 보장하기 때문에 데이터 파이프라인을 구축할 때 많이 사용합니다. Kafka로 모인 데이터를 실시간으로 처리하는 오픈 소스가 많이 존재하는데 대표적으로 Spark, Kafka Streams, Flink 등이 있습니다. 앞서 Router의 Stream-Processor는 Spark Streaming를 사용한다고 했는데 Spark을 선택한 데는 몇 가지 이유가 있습니다.

#### (1) DIC의 자원 활용
DIC는 대규모의 Hadoop 클러스터로 구축되어 있어서 활용 가능한 자원이 존재합니다. Spark는 Yarn 클러스터에 작업을 요청하여 Yarn의 리소스 관리 기능을 사용할 수 있습니다. Yarn에 할당된 자원들의 우선순위와 큐를 활용한 격리 환경을 제공합니다. 그래서 stream-processor를 위한 별도의 큐를 할당하여 자원 사용에 있어 다른 작업들과 영향이 없도록 관리할 수 있었습니다.

또한, 각 파이프라인 별로 보유한 데이터의 수와 Kafka의 파티션 수에 따라 적절히 리소스를 할당합니다. Spark driver/ executor의 코어 수와 메모리를 Router UI에서 파이프라인 별로 수정할 수 있습니다. 그래서 파이프라인의 리소스 설정을 바꾸면서 테스트를 진행하여 최적의 리소스를 사용하도록 조정했습니다.

Spark Streaming은 마이크로 배치 형태로 수행을 하는데, 각 배치마다 Kafka로부터 가져올 데이터의 수를 지정합니다. Kafka로 유입되는 데이터의 속도에 맞춰 변환 작업에서 가져올 데이터의 수도 적절히 조절하며 데이터 처리가 지연되지 않는 최적의 처리량을 조정합니다. 아래 JSON 항목은 Router에서 처리량 Kafka 데이터 수와 Spark가 사용하는 리소스들을 설정한 예를 보여줍니다.
```json
{
   "batch_duration": 10,
   "max_rate_per_partition": 3000,
   "driver_memory": "6G",
   "executor_core": 5,
   "executor_memory": "6G"
}
```

#### (2) 배치 Hive Query
Spark에서 Hive Query를 바로 사용할 수 있다는 점은 큰 장점이 됩니다. 특히나 기존 배치 작업이 Hive Query 기반으로 작성되어 있어서 기존 Query의 큰 변경없이 사용하는 것은 비즈니스 로직 수정 실수도 줄일 수 있기 때문입니다. 그리고 원천이 되는 Kafka 데이터와 기존에 존재하던 Hive 테이블 간의 조인 연산도 필요했기 때문에 Kafka 데이터를 Hive 테이블처럼 인식하여 Query를 작성하는 것이 중요했습니다.

Spark에서는 Kafka의 데이터를 Hive 테이블 형태로 변환할 수 있습니다. Router UI에서 Kafka에 저장된 데이터의 스키마를 넣어서 Kafka 데이터를 Hive 테이블 형태로 변환하여 사용합니다.

아래 JSON은 Kafka 원천 데이터를 의미하는 Source Vertex에 설정한 스키마의 예로서, Kafka 데이터의 형식과 스키마를 지정합니다. 'fields'에 지정된 이름은 Hive 테이블의 컬럼 이름이 됩니다. DIC에서는 원천 데이터의 스키마를 별도의 시스템을 통해 관리하고 있기 때문에 테이블로 전환할 수 있었습니다.
```json
{
    "format": "tsv",
    "fields":
    [
        {
            "name": "part_date",
            "type": "string",
            "optional": []
        },
        {
            "name": "device_model",
            "type": "string",
            "optional": []
        }
    ]
}
```
</br>

## Stream-Processor의 데이터 처리 구조
[그림 3]은 Stream-Processor의 데이터 처리 단계를 도식화한 것이며, 처리 단계는 다음과 같이 4단계로 나눌 수 있습니다.

1. edge, vertex 설정 및 spark session 초기화
2. Kafka 데이터를 위한 DStream 생성
3. DStream으로 temp view 생성 및 SQL 처리
4. 결과 데이터의 포맷 변환 및 Kafka로 전송

![[그림 3] Stream-Processor 데이터 처리 구조](./stream_processor_flow.png)
[그림 3] Stream-Processor 데이터 처리 구조


파이프라인을 위한 설정과 Spark Session을 초기화하고 Kafka로부터 데이터를 가져오기 위한 'DStream'을 생성합니다. DStream은 Kafka 토픽의 파티션 단위로 RDD를 생성합니다. DStream을 생성할 때, Kafka 컨슈머 설정을 전달하게 되는데 Router의 stream-processor는 파이프라인의 기준이 되는 edge의 ID를 Kafka 컨슈머의 groupId로 활용합니다. 그래서 파이프라인이 정지한 이후에 다시 시작한다면 처리를 완료한 Kafka의 오프셋 위치에서 재처리하기 때문에 데이터 중복 처리를 방지할 수 있습니다. DStream은 Kafka로부터 가져온 오프셋 범위를 보유하고 있다가, 데이터 처리가 완료된 이후에 컨슈머 그룹의 오프셋을 커밋하는 인터페이스도 가집니다. 

DStream으로부터 SQL을 수행할 수 있도록 'temp view'를 만듭니다. temp view는 앞서 설명드린 대로 vertex에 지정한 schema로부터 정보를 얻어 컬럼이 구성됩니다. 만들어진 temp view의 스키마가 기존 배치에 작업에서 사용한 테이블과 동일하기 때문에 Query의 큰 수정이 필요없게 됩니다. Query는 edge에 지정된 Query문을 그대로 수행합니다. 

수행된 결과는 Kafka로 넣기 전에 적재할 저장소에 필요한 포맷(json, tsv, avro)으로 적절히 변환합니다. 현재는 HDFS에 적재하여 Hive로 조회할 수 있게 사용 중인데, Router의 Connect는 다양한 저장소(Elasticsearch, S3, HBase 등)로의 데이터 적재를 지원하기 때문에 데이터의 활용 방법에 따라 적절한 포맷과 최종 저장소를 선택하면 됩니다.  
</br>

## 모니터링
대용량 데이터의 실시간 처리에서는 '모니터링'도 중요합니다. 데이터 처리 Job의 정상 수행여부와 함께, 데이터 처리 속도도 함께  모니터링해야 합니다. 선행 데이터 처리가 느려질 경우 이의 처리를 위해 Kafka로 유입된 데이터가 소비되지 못하고 대기하기 때문에, 데이터의 처리 완료 시간도 지연되는데요. 배치로 처리 중이던 작업의 실시간 전환 과정이므로 최종 처리 시간을 보장해야 하기에 더욱 주의를 기울여야 합니다. 그래서 저희는 3가지 관점으로 모니터링을 하고 있습니다.

1. Spark Job의 정상 수행여부 확인 
2. 처리하고 있는 데이터 수 확인 
3. Kafka 데이터의 지연여부 확인

#### (1) Spark Job 정상 수행여부 확인
가장 기본적인 모니터링 절차이며, 수행하는 Job이 정상 수행 중인지를 확인합니다. Spark Streaming이 Yarn 환경에서 실행되며 리소스가 관리되기 때문에 Yarn에 주기적으로 Spark Job을 확인합니다. Spark을 기동할 때, Yarn에서 받은 applicaionId를 별도로 저장하며 이 applicationId로 Yarn이 정상상태인지 확인합니다. Hadoop 또는 Yarn에서의 환경 이슈로 Spark Job이 영향을 받을 수도 있기 때문에 주기적으로 체크하며 이상여부에 따라 알림을 받습니다. 필요에 따라서는 자동으로 Spark이 재시작하도록 설정할 수 있습니다.

#### (2) 처리하고 있는 데이터 수
Spark Streaming로 수행되는 데이터 처리량은 처리 이상여부를 판별하는 중요한 요소입니다. 앞서 Spark Streaming은 일정 수의 Kafka 데이터를 가져와서 마이크로 배치 형태로 수행한다고 했습니다. 즉, 하나의 마이크로 배치에서 가져오는 Kafka 데이터의 수가 처리량이 됩니다. 모니터링을 위해서 Kafka에서 각 파티션별로 가져오는 메시지의 첫 오프셋과 마지막 오프셋의 차이로 데이터 처리량을 계산하며 Elasticsearch에 마이크로 배치마다 로그를 기록하고 있습니다. 기록된 로그는 Grafana를 통해 모니터링 하며 처리량이 일정 기준보다 낮아지면 알림을 받습니다.

#### (3) Kafka 데이터의 지연 여부
Kafka의 데이터를 소비하며 처리를 하기 때문에 Kafka에 보관된 처리되지 않는 데이터 수의 증감으로 지연여부를 판단할 수 있습니다. Kafka 데이터의 지연 수는 Kafka의 마지막 적재 데이터 오프셋과 컨슈머 그룹 오프셋의 차로 파악할 수 있습니다. 그 수치를 LAG(Latency Aware Gap)이라고 말합니다(이 값이 작을수록 데이타가 원활하게 처리됨을 나타냄). LAG을 계산하며 지연 정도를 파악하는데 도움을 주는 오픈소스로는 Burrow(https://github.com/linkedin/Burrow)가 있습니다. Burrow에서 제공하는 LAG을 주기적으로 Elasticsearch로 적재하면서 데이터 지연 여부를 모니터링할 뿐만 아니라, 컨슈머 그룹 오프셋과 LAG의 증가 추이를 통해 상태(WARNING, ERROR, STOPPED)로 표현하기 때문에 정상이 아닌 상태로 변화하면 알림을 받습니다.

![[그림 4] Grafana를 통한 모니터링](./monitoring_grafana.png)
[그림 4] Grafana를 통한 모니터링

## 결론
이번 사례는 배치를 통한 데이터 처리 시 발생하는 시간 지연에 대한 문제를 실시간으로 해결하려고 적용한 결과입니다. 앞으로도 다양한 저장소 간의 연계를 통한 데이터 처리와 AI에 활용할 수 있는 데이터 시스템 구축을 구체화하기 위해 노력하고 있습니다. 감사합니다.  
</br>

### 참고문서
* [Spark Streaming + Kafka Integration Guide](https://spark.apache.org/docs/latest/streaming-kafka-0-10-integration.html)
* [Burrow - Kafka Consumer Lag Checking](https://github.com/linkedin/Burrow)