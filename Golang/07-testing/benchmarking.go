package main

import (
	"fmt"
	"testing"
	"time"
)

// Benchmarking in Go
func main() {
	fmt.Println("=== Benchmarking in Go ===")
	fmt.Println("Run benchmarks with: go test -bench=.")
	fmt.Println("Run specific benchmark: go test -bench=BenchmarkFunctionName")
	fmt.Println("Run benchmarks with memory stats: go test -bench=. -benchmem")
	fmt.Println("Run benchmarks multiple times: go test -bench=. -count=5")
}

// Functions to benchmark
func SlowFunction(n int) int {
	time.Sleep(1 * time.Millisecond) // Simulate slow operation
	return n * 2
}

func FastFunction(n int) int {
	return n * 2
}

func StringConcatenation(n int) string {
	result := ""
	for i := 0; i < n; i++ {
		result += "a"
	}
	return result
}

func StringBuilder(n int) string {
	var result []byte
	for i := 0; i < n; i++ {
		result = append(result, 'a')
	}
	return string(result)
}

func SliceAppend(n int) []int {
	var slice []int
	for i := 0; i < n; i++ {
		slice = append(slice, i)
	}
	return slice
}

func SlicePreAllocated(n int) []int {
	slice := make([]int, 0, n)
	for i := 0; i < n; i++ {
		slice = append(slice, i)
	}
	return slice
}

// Basic benchmarks
func BenchmarkSlowFunction(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SlowFunction(100)
	}
}

func BenchmarkFastFunction(b *testing.B) {
	for i := 0; i < b.N; i++ {
		FastFunction(100)
	}
}

// Benchmarks with different input sizes
func BenchmarkStringConcatenation(b *testing.B) {
	sizes := []int{10, 100, 1000, 10000}

	for _, size := range sizes {
		b.Run(fmt.Sprintf("size_%d", size), func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				StringConcatenation(size)
			}
		})
	}
}

func BenchmarkStringBuilder(b *testing.B) {
	sizes := []int{10, 100, 1000, 10000}

	for _, size := range sizes {
		b.Run(fmt.Sprintf("size_%d", size), func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				StringBuilder(size)
			}
		})
	}
}

// Memory allocation benchmarks
func BenchmarkSliceAppend(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SliceAppend(1000)
	}
}

func BenchmarkSlicePreAllocated(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SlicePreAllocated(1000)
	}
}

// Benchmark with setup
func BenchmarkWithSetup(b *testing.B) {
	// Setup code (not measured)
	data := make([]int, 1000)
	for i := range data {
		data[i] = i
	}

	// Reset timer to exclude setup
	b.ResetTimer()

	// Benchmark code
	for i := 0; i < b.N; i++ {
		sum := 0
		for _, v := range data {
			sum += v
		}
		_ = sum
	}
}

// Benchmark with teardown
func BenchmarkWithTeardown(b *testing.B) {
	for i := 0; i < b.N; i++ {
		// Benchmark code
		result := FastFunction(100)
		_ = result

		// Teardown code (not measured)
		b.StopTimer()
		// cleanup code here
		b.StartTimer()
	}
}

// Benchmark with different parameters
func BenchmarkParameterized(b *testing.B) {
	params := []struct {
		name string
		size int
	}{
		{"small", 10},
		{"medium", 100},
		{"large", 1000},
	}

	for _, param := range params {
		b.Run(param.name, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				SliceAppend(param.size)
			}
		})
	}
}

// Benchmark with memory allocation tracking
func BenchmarkMemoryAllocation(b *testing.B) {
	b.ReportAllocs()

	for i := 0; i < b.N; i++ {
		// This will allocate memory
		slice := make([]int, 100)
		for j := range slice {
			slice[j] = j
		}
		_ = slice
	}
}

// Benchmark with custom metrics
func BenchmarkCustomMetrics(b *testing.B) {
	var totalTime time.Duration

	for i := 0; i < b.N; i++ {
		start := time.Now()

		// Benchmark code
		SlowFunction(100)

		totalTime += time.Since(start)
	}

	// Report custom metric
	b.ReportMetric(float64(totalTime.Nanoseconds())/float64(b.N), "ns/op")
}

// Benchmark with parallel execution
func BenchmarkParallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			FastFunction(100)
		}
	})
}

// Benchmark with different CPU counts
func BenchmarkCPUBound(b *testing.B) {
	cpuCounts := []int{1, 2, 4, 8}

	for _, cpuCount := range cpuCounts {
		b.Run(fmt.Sprintf("cpu_%d", cpuCount), func(b *testing.B) {
			b.SetParallelism(cpuCount)
			b.RunParallel(func(pb *testing.PB) {
				for pb.Next() {
					// CPU-intensive operation
					sum := 0
					for i := 0; i < 1000; i++ {
						sum += i
					}
					_ = sum
				}
			})
		})
	}
}

// Benchmark with different input patterns
func BenchmarkInputPatterns(b *testing.B) {
	patterns := []struct {
		name string
		data []int
	}{
		{"sorted", []int{1, 2, 3, 4, 5}},
		{"reverse", []int{5, 4, 3, 2, 1}},
		{"random", []int{3, 1, 4, 1, 5}},
		{"duplicates", []int{1, 1, 1, 1, 1}},
	}

	for _, pattern := range patterns {
		b.Run(pattern.name, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				// Simulate processing the pattern
				sum := 0
				for _, v := range pattern.data {
					sum += v
				}
				_ = sum
			}
		})
	}
}

// Benchmark with cleanup
func BenchmarkWithCleanup(b *testing.B) {
	b.Cleanup(func() {
		// Cleanup code runs after benchmark
		fmt.Println("Benchmark cleanup")
	})

	for i := 0; i < b.N; i++ {
		FastFunction(100)
	}
}

// Benchmark with different algorithms
func BenchmarkAlgorithms(b *testing.B) {
	algorithms := []struct {
		name string
		fn   func(int) int
	}{
		{"recursive", factorialRecursive},
		{"iterative", factorialIterative},
	}

	for _, algo := range algorithms {
		b.Run(algo.name, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				algo.fn(10)
			}
		})
	}
}

func factorialRecursive(n int) int {
	if n <= 1 {
		return 1
	}
	return n * factorialRecursive(n-1)
}

func factorialIterative(n int) int {
	result := 1
	for i := 2; i <= n; i++ {
		result *= i
	}
	return result
}


