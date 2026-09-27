import os
import re

def strip_dark_classes(directory):
    # Regex to match " dark:xxxx" or "dark:xxxx " or just "dark:xxxx"
    # We want to remove the 'dark:' class and any leading/trailing spaces carefully
    # A simple approach is to find all 'dark:something' and replace it with empty string, 
    # then normalize spaces.
    
    # Matches words starting with dark:
    pattern = re.compile(r'\bdark:[^\s"\']+')

    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.jsx', '.js', '.css')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Remove all dark: classes
                    new_content = pattern.sub('', content)
                    
                    # Also replace any double spaces left behind by the removal
                    # Only inside classNames string? It's fine globally, or just leave spaces.
                    # A better way is r'\s*\bdark:[^\s"\']+' to remove the preceding space too.
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        count += 1
                        print(f"Updated {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
    print(f"Total files updated: {count}")

if __name__ == '__main__':
    strip_dark_classes(r'c:\Projects\TutorMate_WEB\tutormate-web\src')
