package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// HTTP Client in Go
func main() {
	fmt.Println("=== HTTP Client ===")
	
	// 1. Basic HTTP GET request
	basicHTTPDemo()
	
	// 2. HTTP POST request
	httpPOSTDemo()
	
	// 3. HTTP with custom headers
	httpHeadersDemo()
	
	// 4. HTTP with timeout
	httpTimeoutDemo()
	
	// 5. HTTP with JSON
	httpJSONDemo()
	
	// 6. HTTP error handling
	httpErrorHandlingDemo()
}

func basicHTTPDemo() {
	fmt.Println("\n--- Basic HTTP GET Request ---")
	
	// Simple GET request
	resp, err := http.Get("https://httpbin.org/get")
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}
	
	fmt.Printf("Status: %s\n", resp.Status)
	fmt.Printf("Response length: %d bytes\n", len(body))
	fmt.Printf("First 200 characters: %s\n", string(body[:min(200, len(body))]))
}

func httpPOSTDemo() {
	fmt.Println("\n--- HTTP POST Request ---")
	
	// POST request with form data
	formData := "name=John&email=john@example.com"
	resp, err := http.Post("https://httpbin.org/post", "application/x-www-form-urlencoded", 
		strings.NewReader(formData))
	if err != nil {
		fmt.Printf("Error making POST request: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}
	
	fmt.Printf("POST Status: %s\n", resp.Status)
	fmt.Printf("POST Response length: %d bytes\n", len(body))
}

func httpHeadersDemo() {
	fmt.Println("\n--- HTTP with Custom Headers ---")
	
	// Create custom request
	req, err := http.NewRequest("GET", "https://httpbin.org/headers", nil)
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}
	
	// Add custom headers
	req.Header.Set("User-Agent", "Go-HTTP-Client/1.0")
	req.Header.Set("Authorization", "Bearer token123")
	req.Header.Set("X-Custom-Header", "CustomValue")
	
	// Make request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}
	
	fmt.Printf("Headers Status: %s\n", resp.Status)
	fmt.Printf("Headers Response: %s\n", string(body))
}

func httpTimeoutDemo() {
	fmt.Println("\n--- HTTP with Timeout ---")
	
	// Create client with timeout
	client := &http.Client{
		Timeout: 5 * time.Second,
	}
	
	// Request that should succeed
	resp, err := client.Get("https://httpbin.org/delay/1")
	if err != nil {
		fmt.Printf("Error with timeout request: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	fmt.Printf("Timeout request succeeded: %s\n", resp.Status)
	
	// Request that should timeout
	resp, err = client.Get("https://httpbin.org/delay/10")
	if err != nil {
		fmt.Printf("Request timed out as expected: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	fmt.Printf("Unexpected success: %s\n", resp.Status)
}

func httpJSONDemo() {
	fmt.Println("\n--- HTTP with JSON ---")
	
	// JSON data to send
	type User struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Age   int    `json:"age"`
	}
	
	user := User{
		Name:  "John Doe",
		Email: "john@example.com",
		Age:   30,
	}
	
	// Marshal JSON
	jsonData, err := json.Marshal(user)
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}
	
	// Create POST request with JSON
	req, err := http.NewRequest("POST", "https://httpbin.org/post", 
		strings.NewReader(string(jsonData)))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}
	
	req.Header.Set("Content-Type", "application/json")
	
	// Make request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}
	
	fmt.Printf("JSON POST Status: %s\n", resp.Status)
	fmt.Printf("JSON Response: %s\n", string(body))
}

func httpErrorHandlingDemo() {
	fmt.Println("\n--- HTTP Error Handling ---")
	
	// Test different HTTP status codes
	testURLs := []string{
		"https://httpbin.org/status/200", // OK
		"https://httpbin.org/status/404", // Not Found
		"https://httpbin.org/status/500", // Internal Server Error
		"https://httpbin.org/status/503", // Service Unavailable
	}
	
	for _, url := range testURLs {
		resp, err := http.Get(url)
		if err != nil {
			fmt.Printf("Error for %s: %v\n", url, err)
			continue
		}
		defer resp.Body.Close()
		
		fmt.Printf("URL: %s\n", url)
		fmt.Printf("Status: %s\n", resp.Status)
		fmt.Printf("StatusCode: %d\n", resp.StatusCode)
		
		// Check for error status codes
		if resp.StatusCode >= 400 {
			fmt.Printf("Error response: %s\n", resp.Status)
		} else {
			fmt.Printf("Success response: %s\n", resp.Status)
		}
		fmt.Println()
	}
	
	// Handle specific error cases
	resp, err := http.Get("https://httpbin.org/status/404")
	if err != nil {
		fmt.Printf("Network error: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	switch resp.StatusCode {
	case 200:
		fmt.Println("Request successful")
	case 404:
		fmt.Println("Resource not found")
	case 500:
		fmt.Println("Internal server error")
	default:
		fmt.Printf("Unexpected status: %d\n", resp.StatusCode)
	}
}

// Helper function
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// Import strings package
import "strings"


