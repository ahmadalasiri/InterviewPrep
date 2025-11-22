# System Architecture Interview Questions

Common interview questions about computer system architecture, CPU, memory hierarchy, caching, and I/O operations.

## CPU Architecture

### Q1: Explain CPU architecture and how it executes instructions.

**Answer:**
CPU (Central Processing Unit) is the brain of the computer that executes instructions.

**Basic Components:**
- **ALU (Arithmetic Logic Unit)**: Performs arithmetic and logical operations
- **Control Unit**: Directs operations
- **Registers**: Fast storage for data and instructions
- **Cache**: Fast memory for frequently accessed data

**Instruction Execution Cycle (Fetch-Decode-Execute):**

1. **Fetch**: Get instruction from memory
2. **Decode**: Determine what instruction does
3. **Execute**: Perform the operation
4. **Store**: Write results back to memory/registers

**Pipelining:**
- Multiple instructions processed simultaneously
- Different stages of different instructions overlap
- Improves throughput

### Q2: What is pipelining and what are pipeline hazards?

**Answer:**
Pipelining is a technique where multiple instructions are overlapped in execution, similar to an assembly line.

**Pipeline Stages (5-stage):**
1. **IF (Instruction Fetch)**: Get instruction
2. **ID (Instruction Decode)**: Decode and read registers
3. **EX (Execute)**: Perform operation
4. **MEM (Memory Access)**: Access memory if needed
5. **WB (Write Back)**: Write results to register

**Pipeline Hazards:**

1. **Data Hazard**
   - Instruction depends on result of previous instruction
   - Solution: Forwarding, stalling

2. **Structural Hazard**
   - Resource conflict (e.g., same memory port)
   - Solution: Duplicate resources, pipeline stalls

3. **Control Hazard**
   - Branch instructions change program flow
   - Solution: Branch prediction, delayed branching

## Memory Hierarchy

### Q3: Explain the memory hierarchy.

**Answer:**
Memory hierarchy organizes storage by speed, cost, and capacity. Faster memory is smaller and more expensive.

**Levels (fastest to slowest):**

1. **CPU Registers**
   - Fastest, smallest
   - Directly accessible by CPU
   - ~1-2 cycles access time

2. **L1 Cache**
   - Very fast, small (KB)
   - On-chip, separate for data and instructions
   - ~1-3 cycles

3. **L2 Cache**
   - Fast, medium size (MB)
   - On-chip or on-package
   - ~10-20 cycles

4. **L3 Cache**
   - Moderate speed, larger (MB)
   - Shared across cores
   - ~40-75 cycles

5. **Main Memory (RAM)**
   - Slower, large (GB)
   - ~100-300 cycles

6. **Secondary Storage (SSD/HDD)**
   - Slowest, largest (TB)
   - ~100,000+ cycles

**Principle of Locality:**
- **Temporal Locality**: Recently accessed items likely to be accessed again
- **Spatial Locality**: Items near recently accessed items likely to be accessed

### Q4: How does CPU cache work?

**Answer:**
CPU cache stores frequently accessed data and instructions to reduce memory access time.

**Cache Organization:**

**Cache Lines/Blocks:**
- Data transferred in fixed-size blocks (typically 64 bytes)
- Entire block loaded even if only one byte needed

**Cache Mapping:**

1. **Direct Mapped**
   - Each memory block maps to exactly one cache line
   - Simple but can cause conflicts

2. **Fully Associative**
   - Any memory block can go to any cache line
   - Flexible but expensive to implement

3. **Set Associative**
   - Compromise: cache divided into sets
   - Each memory block maps to a set, can go to any line in set
   - Common: 2-way, 4-way, 8-way associative

**Cache Operations:**

- **Cache Hit**: Data found in cache (fast)
- **Cache Miss**: Data not in cache, must fetch from memory
  - **Compulsory Miss**: First access to block
  - **Capacity Miss**: Cache too small
  - **Conflict Miss**: Mapping conflict (direct/set-associative)

**Write Policies:**
- **Write-Through**: Write to cache and memory immediately
- **Write-Back**: Write only to cache, write to memory later when evicted

## I/O Operations

### Q5: Explain interrupts and how they work.

**Answer:**
Interrupts are signals that cause the CPU to temporarily halt current execution and handle the interrupt.

**Types:**

1. **Hardware Interrupts**
   - From external devices (keyboard, mouse, network)
   - Asynchronous

2. **Software Interrupts**
   - From programs (system calls, exceptions)
   - Synchronous

**Interrupt Handling:**

1. **Interrupt Occurs**: Device or software sends interrupt signal
2. **Save State**: CPU saves current context (registers, program counter)
3. **Jump to ISR**: CPU jumps to Interrupt Service Routine
4. **Handle Interrupt**: ISR processes the interrupt
5. **Restore State**: CPU restores saved context
6. **Resume Execution**: Continue from where interrupted

**Benefits:**
- Efficient I/O handling (no polling)
- Responsive system
- Better resource utilization

### Q6: What is DMA (Direct Memory Access)?

**Answer:**
DMA allows devices to transfer data directly to/from memory without involving the CPU for every byte.

**How it works:**
1. CPU initiates DMA transfer
2. DMA controller takes over
3. Data transferred directly between device and memory
4. DMA controller notifies CPU when done

**Benefits:**
- CPU free to do other work during transfer
- Faster data transfer
- Reduced CPU overhead

**Without DMA:**
- CPU must read/write each byte
- CPU busy during entire transfer

**With DMA:**
- CPU only involved in setup and completion
- Much more efficient

## Storage Systems

### Q7: Explain RAID levels.

**Answer:**
RAID (Redundant Array of Independent Disks) combines multiple disks for performance, redundancy, or both.

**Common RAID Levels:**

**RAID 0 (Striping)**
- Data split across disks
- No redundancy
- Fast read/write
- Risk: One disk failure loses all data

**RAID 1 (Mirroring)**
- Data duplicated on multiple disks
- High redundancy
- Read performance improved
- Write performance same as single disk
- Cost: 2x storage needed

**RAID 5 (Striping with Parity)**
- Data and parity distributed across disks
- Can survive one disk failure
- Good read performance
- Write performance limited by parity calculation
- Minimum 3 disks

**RAID 10 (1+0)**
- Combination of RAID 1 and RAID 0
- Mirrored pairs then striped
- High performance and redundancy
- Can survive multiple disk failures (if in different mirrors)
- Minimum 4 disks

### Q8: What is the difference between HDD and SSD?

**Answer:**

**HDD (Hard Disk Drive):**
- Mechanical: spinning platters, moving read/write heads
- Slower: ~100-200 MB/s sequential
- Random access: ~100-200 IOPS
- Cheaper per GB
- Larger capacity
- Moving parts (can fail mechanically)
- Power consumption: Higher

**SSD (Solid State Drive):**
- No moving parts: flash memory
- Faster: ~500-3500 MB/s sequential
- Random access: ~10,000-100,000+ IOPS
- More expensive per GB
- Smaller capacity (but growing)
- More reliable (no moving parts)
- Power consumption: Lower
- Limited write cycles (but modern SSDs last long)

**Use Cases:**
- **SSD**: OS, applications, frequently accessed data
- **HDD**: Large storage, archives, backups

## Performance

### Q9: What is branch prediction?

**Answer:**
Branch prediction is a technique used by CPUs to guess which direction a branch (if/else, loop) will take before the condition is evaluated.

**Why needed:**
- Branches cause pipeline stalls
- CPU must wait for condition evaluation
- Prediction allows CPU to continue speculatively

**Prediction Strategies:**

1. **Static Prediction**
   - Always predict same direction
   - Simple but not optimal

2. **Dynamic Prediction**
   - Based on history
   - Branch prediction buffer/cache
   - Learns from past behavior

**Types:**
- **1-bit predictor**: Remember last outcome
- **2-bit predictor**: More stable, requires two wrong predictions to change
- **Correlating predictor**: Consider other branches

**Misprediction Penalty:**
- Pipeline must be flushed
- Correct path must be fetched
- Performance impact

### Q10: Explain virtual memory and paging.

**Answer:**
Virtual memory allows programs to use more memory than physically available by using disk as extension of RAM.

**How it works:**
- Each process has virtual address space
- Virtual addresses mapped to physical addresses
- Memory divided into pages (typically 4KB)
- Pages can be in RAM or on disk

**Page Table:**
- Maps virtual pages to physical frames
- Stored in memory
- Accessed by Memory Management Unit (MMU)

**Page Fault:**
- Occurs when accessing page not in RAM
- OS loads page from disk
- May need to evict another page (if RAM full)

**Benefits:**
- Programs can be larger than physical memory
- Memory protection (each process isolated)
- Efficient memory utilization
- Simplified memory management

**TLB (Translation Lookaside Buffer):**
- Cache for page table entries
- Reduces memory access for address translation
- Very fast lookup

---

*Add more questions as you encounter them in interviews or study materials.*

