package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// File Operations in Go
func main() {
	fmt.Println("=== File Operations ===")

	// 1. Basic file operations
	basicFileOperationsDemo()

	// 2. File reading
	fileReadingDemo()

	// 3. File writing
	fileWritingDemo()

	// 4. File copying
	fileCopyingDemo()

	// 5. Directory operations
	directoryOperationsDemo()

	// 6. File information
	fileInfoDemo()
}

func basicFileOperationsDemo() {
	fmt.Println("\n--- Basic File Operations ---")

	// Create a file
	file, err := os.Create("example.txt")
	if err != nil {
		fmt.Printf("Error creating file: %v\n", err)
		return
	}
	defer file.Close()

	// Write to file
	_, err = file.WriteString("Hello, World!\nThis is a test file.\n")
	if err != nil {
		fmt.Printf("Error writing to file: %v\n", err)
		return
	}

	fmt.Println("File created and written successfully")

	// Check if file exists
	if _, err := os.Stat("example.txt"); err == nil {
		fmt.Println("File exists")
	} else if os.IsNotExist(err) {
		fmt.Println("File does not exist")
	} else {
		fmt.Printf("Error checking file: %v\n", err)
	}

	// Rename file
	err = os.Rename("example.txt", "renamed.txt")
	if err != nil {
		fmt.Printf("Error renaming file: %v\n", err)
		return
	}
	fmt.Println("File renamed successfully")

	// Remove file
	err = os.Remove("renamed.txt")
	if err != nil {
		fmt.Printf("Error removing file: %v\n", err)
		return
	}
	fmt.Println("File removed successfully")
}

func fileReadingDemo() {
	fmt.Println("\n--- File Reading ---")

	// Create a test file
	content := "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\n"
	err := os.WriteFile("test.txt", []byte(content), 0644)
	if err != nil {
		fmt.Printf("Error creating test file: %v\n", err)
		return
	}
	defer os.Remove("test.txt")

	// Read entire file
	data, err := os.ReadFile("test.txt")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	fmt.Printf("File content: %s", string(data))

	// Read file line by line
	file, err := os.Open("test.txt")
	if err != nil {
		fmt.Printf("Error opening file: %v\n", err)
		return
	}
	defer file.Close()

	fmt.Println("Reading file line by line:")
	lineNum := 1
	for {
		var line string
		_, err := fmt.Fscanf(file, "%s\n", &line)
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Printf("Error reading line: %v\n", err)
			break
		}
		fmt.Printf("Line %d: %s\n", lineNum, line)
		lineNum++
	}

	// Read file with buffer
	file, err = os.Open("test.txt")
	if err != nil {
		fmt.Printf("Error opening file: %v\n", err)
		return
	}
	defer file.Close()

	fmt.Println("Reading file with buffer:")
	buffer := make([]byte, 10)
	for {
		n, err := file.Read(buffer)
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Printf("Error reading: %v\n", err)
			break
		}
		fmt.Printf("Read %d bytes: %s\n", n, string(buffer[:n]))
	}
}

func fileWritingDemo() {
	fmt.Println("\n--- File Writing ---")

	// Write string to file
	err := os.WriteFile("write_test.txt", []byte("Hello, World!"), 0644)
	if err != nil {
		fmt.Printf("Error writing file: %v\n", err)
		return
	}
	defer os.Remove("write_test.txt")

	// Append to file
	file, err := os.OpenFile("write_test.txt", os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Printf("Error opening file for append: %v\n", err)
		return
	}
	defer file.Close()

	_, err = file.WriteString("\nThis is appended text")
	if err != nil {
		fmt.Printf("Error appending to file: %v\n", err)
		return
	}

	// Read the file to verify
	data, err := os.ReadFile("write_test.txt")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}
	fmt.Printf("File content after append: %s\n", string(data))

	// Write with different modes
	file, err = os.OpenFile("mode_test.txt", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Printf("Error creating file: %v\n", err)
		return
	}
	defer file.Close()
	defer os.Remove("mode_test.txt")

	_, err = file.WriteString("This file was created with specific mode")
	if err != nil {
		fmt.Printf("Error writing to file: %v\n", err)
		return
	}

	fmt.Println("File written with specific mode")
}

func fileCopyingDemo() {
	fmt.Println("\n--- File Copying ---")

	// Create source file
	sourceContent := "This is the source file content.\nIt contains multiple lines.\n"
	err := os.WriteFile("source.txt", []byte(sourceContent), 0644)
	if err != nil {
		fmt.Printf("Error creating source file: %v\n", err)
		return
	}
	defer os.Remove("source.txt")

	// Copy file
	err = copyFile("source.txt", "destination.txt")
	if err != nil {
		fmt.Printf("Error copying file: %v\n", err)
		return
	}
	defer os.Remove("destination.txt")

	// Verify copy
	sourceData, err := os.ReadFile("source.txt")
	if err != nil {
		fmt.Printf("Error reading source file: %v\n", err)
		return
	}

	destData, err := os.ReadFile("destination.txt")
	if err != nil {
		fmt.Printf("Error reading destination file: %v\n", err)
		return
	}

	if string(sourceData) == string(destData) {
		fmt.Println("File copied successfully")
	} else {
		fmt.Println("File copy failed - content mismatch")
	}
}

func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	if err != nil {
		return err
	}

	return destFile.Sync()
}

func directoryOperationsDemo() {
	fmt.Println("\n--- Directory Operations ---")

	// Create directory
	err := os.Mkdir("test_dir", 0755)
	if err != nil {
		fmt.Printf("Error creating directory: %v\n", err)
		return
	}
	defer os.RemoveAll("test_dir")

	// Create nested directories
	err = os.MkdirAll("test_dir/nested/deep", 0755)
	if err != nil {
		fmt.Printf("Error creating nested directories: %v\n", err)
		return
	}

	// Create files in directories
	err = os.WriteFile("test_dir/file1.txt", []byte("File 1"), 0644)
	if err != nil {
		fmt.Printf("Error creating file1: %v\n", err)
		return
	}

	err = os.WriteFile("test_dir/nested/file2.txt", []byte("File 2"), 0644)
	if err != nil {
		fmt.Printf("Error creating file2: %v\n", err)
		return
	}

	// List directory contents
	fmt.Println("Directory contents:")
	err = filepath.Walk("test_dir", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		fmt.Printf("  %s\n", path)
		return nil
	})
	if err != nil {
		fmt.Printf("Error walking directory: %v\n", err)
		return
	}

	// Read directory
	entries, err := os.ReadDir("test_dir")
	if err != nil {
		fmt.Printf("Error reading directory: %v\n", err)
		return
	}

	fmt.Println("Directory entries:")
	for _, entry := range entries {
		fmt.Printf("  %s (isDir: %t)\n", entry.Name(), entry.IsDir())
	}
}

func fileInfoDemo() {
	fmt.Println("\n--- File Information ---")

	// Create a test file
	err := os.WriteFile("info_test.txt", []byte("Test content"), 0644)
	if err != nil {
		fmt.Printf("Error creating test file: %v\n", err)
		return
	}
	defer os.Remove("info_test.txt")

	// Get file info
	info, err := os.Stat("info_test.txt")
	if err != nil {
		fmt.Printf("Error getting file info: %v\n", err)
		return
	}

	fmt.Printf("File name: %s\n", info.Name())
	fmt.Printf("File size: %d bytes\n", info.Size())
	fmt.Printf("File mode: %s\n", info.Mode())
	fmt.Printf("File mod time: %s\n", info.ModTime())
	fmt.Printf("Is directory: %t\n", info.IsDir())

	// Check file permissions
	fmt.Printf("Is readable: %t\n", info.Mode()&0400 != 0)
	fmt.Printf("Is writable: %t\n", info.Mode()&0200 != 0)
	fmt.Printf("Is executable: %t\n", info.Mode()&0100 != 0)

	// Get current working directory
	wd, err := os.Getwd()
	if err != nil {
		fmt.Printf("Error getting working directory: %v\n", err)
		return
	}
	fmt.Printf("Current working directory: %s\n", wd)

	// Get temporary directory
	tempDir := os.TempDir()
	fmt.Printf("Temporary directory: %s\n", tempDir)
}


