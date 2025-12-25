# 🌐 Distributed Databases

How to scale databases across multiple nodes and maintain consistency.

## 📑 Topics to Master

- [ ] **Replication Strategies**
  - **Single-Leader**: Simplicity vs bottleneck.
  - **Multi-Leader**: Handling write conflicts.
  - **Leaderless (Dynamo-style)**: Quorums (W + R > N).
- [ ] **Horizontal Scaling**
  - **Sharding**: Key-based, Range-based, Consistent Hashing.
  - **Rebalancing**: How to move data without downtime.
- [ ] **Consensus & Coordination**
  - **Paxos & Raft**: How nodes agree on state.
  - **Distributed Locking**: Using Zookeeper or Etcd.
- [ ] **Consistency Models**
  - Linearizability (Strong Consistency).
  - Eventual Consistency (The reality of large-scale systems).
  - Causal Consistency.
- [ ] **Transaction Management**
  - Two-Phase Commit (2PC).
  - Saga Pattern (Choreography vs Orchestration).

