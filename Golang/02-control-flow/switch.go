package main

import (
	"fmt"
	"time"
)

// Switch Statements in Go
func main() {
	fmt.Println("=== Switch Statements ===")

	// 1. Basic switch statement
	basicSwitchDemo()

	// 2. Switch with multiple cases
	multipleCasesDemo()

	// 3. Switch with fallthrough
	fallthroughDemo()

	// 4. Switch without expression
	switchWithoutExpression()

	// 5. Type switch
	typeSwitchDemo()

	// 6. Switch with initialization
	switchWithInitDemo()

	// 7. Switch vs if-else comparison
	switchVsIfElseDemo()
}

func basicSwitchDemo() {
	fmt.Println("\n--- Basic Switch Statement ---")

	day := "Monday"

	switch day {
	case "Monday":
		fmt.Println("Start of the work week")
	case "Tuesday", "Wednesday", "Thursday":
		fmt.Println("Mid week")
	case "Friday":
		fmt.Println("TGIF!")
	case "Saturday", "Sunday":
		fmt.Println("Weekend!")
	default:
		fmt.Println("Invalid day")
	}

	// Switch with integer
	score := 85

	switch score {
	case 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100:
		fmt.Println("Grade: A")
	case 80, 81, 82, 83, 84, 85, 86, 87, 88, 89:
		fmt.Println("Grade: B")
	case 70, 71, 72, 73, 74, 75, 76, 77, 78, 79:
		fmt.Println("Grade: C")
	default:
		fmt.Println("Grade: D or F")
	}
}

func multipleCasesDemo() {
	fmt.Println("\n--- Switch with Multiple Cases ---")

	month := "March"

	switch month {
	case "December", "January", "February":
		fmt.Println("Winter")
	case "March", "April", "May":
		fmt.Println("Spring")
	case "June", "July", "August":
		fmt.Println("Summer")
	case "September", "October", "November":
		fmt.Println("Fall")
	default:
		fmt.Println("Invalid month")
	}

	// Character switch
	grade := 'B'

	switch grade {
	case 'A', 'a':
		fmt.Println("Excellent!")
	case 'B', 'b':
		fmt.Println("Good!")
	case 'C', 'c':
		fmt.Println("Average")
	case 'D', 'd':
		fmt.Println("Below average")
	case 'F', 'f':
		fmt.Println("Fail")
	default:
		fmt.Println("Invalid grade")
	}
}

func fallthroughDemo() {
	fmt.Println("\n--- Switch with Fallthrough ---")

	// Note: Go's switch doesn't fall through by default
	// Use 'fallthrough' keyword to continue to next case

	number := 2

	switch number {
	case 1:
		fmt.Println("One")
		fallthrough
	case 2:
		fmt.Println("Two")
		fallthrough
	case 3:
		fmt.Println("Three")
		fallthrough
	default:
		fmt.Println("Default case")
	}

	// Practical example with fallthrough
	userLevel := "premium"

	switch userLevel {
	case "admin":
		fmt.Println("Admin privileges")
		fallthrough
	case "premium":
		fmt.Println("Premium features")
		fallthrough
	case "standard":
		fmt.Println("Standard features")
		fallthrough
	case "basic":
		fmt.Println("Basic features")
	default:
		fmt.Println("No access")
	}
}

func switchWithoutExpression() {
	fmt.Println("\n--- Switch Without Expression ---")

	// Switch without expression is like if-else chain
	hour := time.Now().Hour()

	switch {
	case hour < 6:
		fmt.Println("Good night!")
	case hour < 12:
		fmt.Println("Good morning!")
	case hour < 18:
		fmt.Println("Good afternoon!")
	case hour < 22:
		fmt.Println("Good evening!")
	default:
		fmt.Println("Good night!")
	}

	// Another example
	temperature := 25

	switch {
	case temperature < 0:
		fmt.Println("Freezing")
	case temperature < 10:
		fmt.Println("Cold")
	case temperature < 20:
		fmt.Println("Cool")
	case temperature < 30:
		fmt.Println("Warm")
	default:
		fmt.Println("Hot")
	}
}

func typeSwitchDemo() {
	fmt.Println("\n--- Type Switch ---")

	// Type switch works with interface{} type
	var value interface{} = "Hello, World!"

	switch v := value.(type) {
	case int:
		fmt.Printf("Integer: %d\n", v)
	case float64:
		fmt.Printf("Float64: %.2f\n", v)
	case string:
		fmt.Printf("String: %s\n", v)
	case bool:
		fmt.Printf("Boolean: %t\n", v)
	case []int:
		fmt.Printf("Slice of int: %v\n", v)
	case map[string]int:
		fmt.Printf("Map: %v\n", v)
	default:
		fmt.Printf("Unknown type: %T\n", v)
	}

	// Multiple type switch examples
	values := []interface{}{42, 3.14, "Go", true, []int{1, 2, 3}}

	for _, val := range values {
		switch v := val.(type) {
		case int:
			fmt.Printf("Processing integer: %d\n", v)
		case float64:
			fmt.Printf("Processing float: %.2f\n", v)
		case string:
			fmt.Printf("Processing string: %s\n", v)
		case bool:
			fmt.Printf("Processing boolean: %t\n", v)
		case []int:
			fmt.Printf("Processing slice: %v\n", v)
		}
	}
}

func switchWithInitDemo() {
	fmt.Println("\n--- Switch with Initialization ---")

	// Initialize variable in switch statement
	switch day := time.Now().Weekday(); day {
	case time.Monday:
		fmt.Println("Monday blues")
	case time.Tuesday, time.Wednesday, time.Thursday:
		fmt.Println("Mid week")
	case time.Friday:
		fmt.Println("Friday feeling")
	case time.Saturday, time.Sunday:
		fmt.Println("Weekend!")
	}

	// Another example with initialization
	switch num := 42; {
	case num < 0:
		fmt.Println("Negative")
	case num == 0:
		fmt.Println("Zero")
	case num > 0 && num < 100:
		fmt.Println("Positive and less than 100")
	default:
		fmt.Println("100 or greater")
	}
}

func switchVsIfElseDemo() {
	fmt.Println("\n--- Switch vs If-Else Comparison ---")

	// Same logic implemented with both switch and if-else
	grade := 85

	// Using if-else
	fmt.Println("Using if-else:")
	if grade >= 90 {
		fmt.Println("Grade: A")
	} else if grade >= 80 {
		fmt.Println("Grade: B")
	} else if grade >= 70 {
		fmt.Println("Grade: C")
	} else if grade >= 60 {
		fmt.Println("Grade: D")
	} else {
		fmt.Println("Grade: F")
	}

	// Using switch (without expression)
	fmt.Println("Using switch:")
	switch {
	case grade >= 90:
		fmt.Println("Grade: A")
	case grade >= 80:
		fmt.Println("Grade: B")
	case grade >= 70:
		fmt.Println("Grade: C")
	case grade >= 60:
		fmt.Println("Grade: D")
	default:
		fmt.Println("Grade: F")
	}

	// When to use switch vs if-else:
	// - Use switch when comparing a single variable against multiple values
	// - Use if-else for complex boolean conditions
	// - Switch is often more readable for multiple discrete values
	// - If-else is better for ranges and complex conditions
}


