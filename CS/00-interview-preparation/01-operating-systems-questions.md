# Operating Systems Interview Questions

Common interview questions about operating systems, processes, threads, memory management, and system concepts.

## Basic Concepts

### Q1: What is an Operating System?

**Answer:**
An operating system (OS) is system software that manages computer hardware and software resources and provides common services for computer programs. It acts as an intermediary between users and the computer hardware.

**Key Functions:**
- Process management
- Memory management
- File system management
- Device management
- Security and access control
- User interface

### Q2: What is the difference between a process and a thread?

**Answer:**

**Process:**
- Independent execution unit
- Has its own memory space (address space)
- More isolated and secure
- Higher overhead for creation and context switching
- Inter-process communication (IPC) required for communication

**Thread:**
- Lightweight process
- Shares memory space with other threads in the same process
- Lower overhead
- Faster context switching
- Direct memory sharing possible (but requires synchronization)

**Example:**
- A web browser process may have multiple threads: one for UI, one for network requests, one for rendering

### Q3: What is context switching?

**Answer:**
Context switching is the process of saving the state of a process or thread so it can be resumed later, and restoring the state of another process or thread to continue its execution.

**What gets saved:**
- CPU registers
- Program counter
- Stack pointer
- Memory management information
- I/O state information

**Overhead:**
- Time taken to save/restore state
- Cache misses (TLB flush)
- Pipeline stalls

## Process Management

### Q4: Explain the process states in an operating system.

**Answer:**
A process can be in one of these states:

1. **New**: Process is being created
2. **Ready**: Process is ready to run, waiting for CPU
3. **Running**: Process is currently executing on CPU
4. **Waiting/Blocked**: Process is waiting for an event (I/O, signal, etc.)
5. **Terminated**: Process has finished execution

**State Transitions:**
- New → Ready: Process admitted
- Ready → Running: CPU scheduler selects process
- Running → Ready: Time slice expired or preempted
- Running → Waiting: Waiting for I/O or event
- Waiting → Ready: Event occurred
- Running → Terminated: Process completed

### Q5: What are different CPU scheduling algorithms?

**Answer:**

1. **First-Come-First-Served (FCFS)**
   - Simple, non-preemptive
   - Problem: Convoy effect (short processes wait for long ones)

2. **Shortest Job First (SJF)**
   - Selects process with shortest execution time
   - Optimal for average waiting time
   - Problem: Starvation of long processes

3. **Round Robin (RR)**
   - Each process gets time quantum
   - Preemptive
   - Good for time-sharing systems

4. **Priority Scheduling**
   - Processes assigned priorities
   - Higher priority processes run first
   - Problem: Starvation of low-priority processes

5. **Multilevel Queue**
   - Multiple queues with different priorities
   - Each queue may have different scheduling algorithm

6. **Multilevel Feedback Queue**
   - Processes can move between queues
   - Prevents starvation
   - Adapts to process behavior

## Memory Management

### Q6: What is virtual memory?

**Answer:**
Virtual memory is a memory management technique that allows a computer to compensate for physical memory shortages by temporarily transferring pages of data from RAM to disk storage.

**Benefits:**
- Allows programs larger than physical memory
- Memory protection (each process has its own address space)
- Efficient memory utilization
- Simplified programming (programmers don't need to manage physical memory)

**How it works:**
- Each process has a virtual address space
- Virtual addresses are mapped to physical addresses
- Pages not in use can be swapped to disk
- Page faults occur when accessing swapped pages

### Q7: Explain paging and segmentation.

**Answer:**

**Paging:**
- Physical memory divided into fixed-size blocks (frames)
- Virtual memory divided into fixed-size blocks (pages)
- Pages mapped to frames
- No external fragmentation
- Internal fragmentation possible

**Segmentation:**
- Memory divided into variable-size segments
- Segments represent logical units (code, data, stack)
- External fragmentation possible
- Better matches program structure

**Combined (Paged Segmentation):**
- Segments divided into pages
- Combines benefits of both

## Synchronization

### Q8: What is a deadlock? How can it be prevented?

**Answer:**
A deadlock is a situation where two or more processes are blocked forever, waiting for each other to release resources.

**Necessary Conditions (all must hold):**
1. **Mutual Exclusion**: Resources cannot be shared
2. **Hold and Wait**: Process holds resources while waiting for others
3. **No Preemption**: Resources cannot be forcibly taken
4. **Circular Wait**: Circular chain of processes waiting for resources

**Prevention:**
- Remove one of the necessary conditions
- Use resource ordering (prevent circular wait)
- Allow preemption
- Require all resources at once (no hold and wait)

**Avoidance:**
- Banker's algorithm
- Check if allocation is safe before granting

**Detection and Recovery:**
- Detect deadlocks periodically
- Recover by killing processes or preempting resources

### Q9: What is a race condition?

**Answer:**
A race condition occurs when the behavior of a program depends on the relative timing of events, such as the order in which threads execute. The outcome is non-deterministic and can lead to incorrect results.

**Example:**
```c
// Thread 1 and Thread 2 both execute:
counter = counter + 1;

// Without synchronization, final value may be incorrect
```

**Solution:**
- Use locks/mutexes
- Use atomic operations
- Use synchronization primitives

## File Systems

### Q10: How does a file system work?

**Answer:**
A file system organizes and manages how data is stored and retrieved on storage devices.

**Components:**
1. **Directory Structure**: Hierarchical organization of files
2. **File Metadata**: Information about files (size, permissions, timestamps)
3. **Storage Allocation**: How files are stored on disk
4. **Access Methods**: Sequential, direct, indexed

**Common File Systems:**
- **FAT32**: Simple, widely compatible
- **NTFS**: Windows, supports large files, permissions
- **ext4**: Linux, journaling, large file support
- **HFS+**: macOS

**Operations:**
- Create, read, write, delete files
- Directory operations
- Permission management
- Disk space management

---

*Add more questions as you encounter them in interviews or study materials.*

