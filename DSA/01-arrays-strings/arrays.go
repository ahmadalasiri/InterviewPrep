package main

import (
	"fmt"
	"sort"
	"strings"
)

// ============================================
// ARRAY BASICS
// ============================================

// FindMax finds the maximum element in array
// Time: O(n), Space: O(1)
func FindMax(arr []int) (int, error) {
	if len(arr) == 0 {
		return 0, fmt.Errorf("empty array")
	}

	max := arr[0]
	for i := 1; i < len(arr); i++ {
		if arr[i] > max {
			max = arr[i]
		}
	}
	return max, nil
}

// ReverseArray reverses array in place
// Time: O(n), Space: O(1)
func ReverseArray(arr []int) []int {
	left, right := 0, len(arr)-1

	for left < right {
		arr[left], arr[right] = arr[right], arr[left]
		left++
		right--
	}

	return arr
}

// RemoveDuplicates removes duplicates from sorted array
// Time: O(n), Space: O(1)
func RemoveDuplicates(nums []int) int {
	if len(nums) == 0 {
		return 0
	}

	slow := 0
	for fast := 1; fast < len(nums); fast++ {
		if nums[fast] != nums[slow] {
			slow++
			nums[slow] = nums[fast]
		}
	}

	return slow + 1
}

// RotateArray rotates array to right by k positions
// Time: O(n), Space: O(1)
func RotateArray(nums []int, k int) []int {
	n := len(nums)
	k = k % n

	reverse := func(start, end int) {
		for start < end {
			nums[start], nums[end] = nums[end], nums[start]
			start++
			end--
		}
	}

	reverse(0, n-1)
	reverse(0, k-1)
	reverse(k, n-1)

	return nums
}

// ============================================
// TWO POINTERS
// ============================================

// TwoSumSorted finds two numbers that add up to target in sorted array
// Time: O(n), Space: O(1)
func TwoSumSorted(numbers []int, target int) []int {
	left, right := 0, len(numbers)-1

	for left < right {
		sum := numbers[left] + numbers[right]

		if sum == target {
			return []int{left, right}
		} else if sum < target {
			left++
		} else {
			right--
		}
	}

	return nil
}

// MaxArea finds the container with most water
// Time: O(n), Space: O(1)
func MaxArea(height []int) int {
	left, right := 0, len(height)-1
	maxWater := 0

	for left < right {
		width := right - left
		currentHeight := min(height[left], height[right])
		area := width * currentHeight

		maxWater = max(maxWater, area)

		if height[left] < height[right] {
			left++
		} else {
			right--
		}
	}

	return maxWater
}

// ThreeSum finds all triplets that sum to zero
// Time: O(n²), Space: O(1)
func ThreeSum(nums []int) [][]int {
	result := [][]int{}
	sort.Ints(nums)

	for i := 0; i < len(nums)-2; i++ {
		if i > 0 && nums[i] == nums[i-1] {
			continue
		}

		left := i + 1
		right := len(nums) - 1
		target := -nums[i]

		for left < right {
			sum := nums[left] + nums[right]

			if sum == target {
				result = append(result, []int{nums[i], nums[left], nums[right]})

				for left < right && nums[left] == nums[left+1] {
					left++
				}
				for left < right && nums[right] == nums[right-1] {
					right--
				}

				left++
				right--
			} else if sum < target {
				left++
			} else {
				right--
			}
		}
	}

	return result
}

// IsPalindrome checks if string is a valid palindrome
// Time: O(n), Space: O(1)
func IsPalindrome(s string) bool {
	s = strings.ToLower(s)

	left, right := 0, len(s)-1

	for left < right {
		// Skip non-alphanumeric characters
		for left < right && !isAlphanumeric(rune(s[left])) {
			left++
		}
		for left < right && !isAlphanumeric(rune(s[right])) {
			right--
		}

		if s[left] != s[right] {
			return false
		}

		left++
		right--
	}

	return true
}

func isAlphanumeric(c rune) bool {
	return (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')
}

// ============================================
// SLIDING WINDOW
// ============================================

// MaxSumSubarray finds maximum sum of k consecutive elements
// Time: O(n), Space: O(1)
func MaxSumSubarray(arr []int, k int) (int, error) {
	if len(arr) < k {
		return 0, fmt.Errorf("array length less than k")
	}

	windowSum := 0
	for i := 0; i < k; i++ {
		windowSum += arr[i]
	}

	maxSum := windowSum

	for i := k; i < len(arr); i++ {
		windowSum = windowSum - arr[i-k] + arr[i]
		maxSum = max(maxSum, windowSum)
	}

	return maxSum, nil
}

// LengthOfLongestSubstring finds longest substring without repeating characters
// Time: O(n), Space: O(min(m, n))
func LengthOfLongestSubstring(s string) int {
	seen := make(map[byte]int)
	left := 0
	maxLength := 0

	for right := 0; right < len(s); right++ {
		char := s[right]

		if idx, ok := seen[char]; ok && idx >= left {
			left = idx + 1
		}

		seen[char] = right
		maxLength = max(maxLength, right-left+1)
	}

	return maxLength
}

// ============================================
// STRING MANIPULATION
// ============================================

// LongestPalindrome finds longest palindromic substring
// Time: O(n²), Space: O(1)
func LongestPalindrome(s string) string {
	if len(s) < 2 {
		return s
	}

	start := 0
	maxLength := 1

	expandAroundCenter := func(left, right int) int {
		for left >= 0 && right < len(s) && s[left] == s[right] {
			left--
			right++
		}
		return right - left - 1
	}

	for i := 0; i < len(s); i++ {
		len1 := expandAroundCenter(i, i)
		len2 := expandAroundCenter(i, i+1)
		length := max(len1, len2)

		if length > maxLength {
			maxLength = length
			start = i - (length-1)/2
		}
	}

	return s[start : start+maxLength]
}

// GroupAnagrams groups anagrams together
// Time: O(n * k log k), Space: O(n * k)
func GroupAnagrams(strs []string) [][]string {
	groups := make(map[string][]string)

	for _, str := range strs {
		// Sort string to use as key
		runes := []rune(str)
		sort.Slice(runes, func(i, j int) bool {
			return runes[i] < runes[j]
		})
		key := string(runes)

		groups[key] = append(groups[key], str)
	}

	result := make([][]string, 0, len(groups))
	for _, group := range groups {
		result = append(result, group)
	}

	return result
}

// ============================================
// MATRIX PROBLEMS
// ============================================

// RotateMatrix rotates matrix 90 degrees clockwise
// Time: O(n²), Space: O(1)
func RotateMatrix(matrix [][]int) [][]int {
	n := len(matrix)

	// Transpose
	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
		}
	}

	// Reverse each row
	for i := 0; i < n; i++ {
		left, right := 0, n-1
		for left < right {
			matrix[i][left], matrix[i][right] = matrix[i][right], matrix[i][left]
			left++
			right--
		}
	}

	return matrix
}

// SpiralOrder returns matrix elements in spiral order
// Time: O(m*n), Space: O(1)
func SpiralOrder(matrix [][]int) []int {
	if len(matrix) == 0 {
		return []int{}
	}

	result := []int{}
	top, bottom := 0, len(matrix)-1
	left, right := 0, len(matrix[0])-1

	for top <= bottom && left <= right {
		// Traverse right
		for i := left; i <= right; i++ {
			result = append(result, matrix[top][i])
		}
		top++

		// Traverse down
		for i := top; i <= bottom; i++ {
			result = append(result, matrix[i][right])
		}
		right--

		// Traverse left
		if top <= bottom {
			for i := right; i >= left; i-- {
				result = append(result, matrix[bottom][i])
			}
			bottom--
		}

		// Traverse up
		if left <= right {
			for i := bottom; i >= top; i-- {
				result = append(result, matrix[i][left])
			}
			left++
		}
	}

	return result
}

// ============================================
// HELPER FUNCTIONS
// ============================================

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// ============================================
// TESTS
// ============================================

func main() {
	fmt.Println("=== Array Basics Tests ===")
	max, _ := FindMax([]int{3, 1, 4, 1, 5, 9, 2})
	fmt.Printf("Find Max: %d\n", max) // 9

	fmt.Printf("Reverse: %v\n", ReverseArray([]int{1, 2, 3, 4, 5})) // [5,4,3,2,1]

	arr := []int{1, 1, 2, 2, 3}
	length := RemoveDuplicates(arr)
	fmt.Printf("Remove Duplicates: %d\n", length) // 3

	fmt.Printf("Rotate Array: %v\n", RotateArray([]int{1, 2, 3, 4, 5}, 2)) // [4,5,1,2,3]

	fmt.Println("\n=== Two Pointers Tests ===")
	fmt.Printf("Two Sum Sorted: %v\n", TwoSumSorted([]int{2, 7, 11, 15}, 9))          // [0,1]
	fmt.Printf("Max Area: %d\n", MaxArea([]int{1, 8, 6, 2, 5, 4, 8, 3, 7}))           // 49
	fmt.Printf("Three Sum: %v\n", ThreeSum([]int{-1, 0, 1, 2, -1, -4}))               // [[-1,-1,2],[-1,0,1]]
	fmt.Printf("Is Palindrome: %v\n", IsPalindrome("A man, a plan, a canal: Panama")) // true

	fmt.Println("\n=== Sliding Window Tests ===")
	maxSum, _ := MaxSumSubarray([]int{2, 1, 5, 1, 3, 2}, 3)
	fmt.Printf("Max Sum Subarray: %d\n", maxSum)                                // 9
	fmt.Printf("Longest Substring: %d\n", LengthOfLongestSubstring("abcabcbb")) // 3

	fmt.Println("\n=== String Tests ===")
	fmt.Printf("Longest Palindrome: %s\n", LongestPalindrome("babad")) // "bab" or "aba"
	fmt.Printf("Group Anagrams: %v\n", GroupAnagrams([]string{"eat", "tea", "tan", "ate", "nat", "bat"}))

	fmt.Println("\n=== Matrix Tests ===")
	fmt.Printf("Spiral Order: %v\n", SpiralOrder([][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}})) // [1,2,3,6,9,8,7,4,5]
}




