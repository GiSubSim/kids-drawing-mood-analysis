import os

# 1. 저장할 파일명
output_filename = "project_code.txt"

# 2. 무시할 폴더 (너무 크거나 불필요한 것들)
ignore_dirs = {
    "node_modules", ".next", "__pycache__", ".git", ".vscode", ".idea", 
    "venv", "env", ".DS_Store", "dist", "build", "coverage"
}

# 3. 무시할 파일 (바이너리, 잠금 파일, 비밀 키 파일 등)
ignore_files = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", 
    ".DS_Store", "favicon.ico", ".env", ".env.local" # .env는 보안상 제외
}

# 4. 가져올 파일 확장자 (코드 파일만)
valid_extensions = {
    ".py", ".tsx", ".ts", ".js", ".json", ".css", ".html", 
    ".txt", ".md", ".yml", ".yaml", "Dockerfile", "requirements.txt"
}

def is_text_file(filename):
    """확장자를 기반으로 텍스트 파일인지 확인"""
    return any(filename.endswith(ext) for ext in valid_extensions) or filename in ["Dockerfile", "Makefile"]

def collect_project_code():
    cwd = os.getcwd() # 현재 위치 (루트)
    
    with open(output_filename, "w", encoding="utf-8") as outfile:
        outfile.write(f"Project Root: {cwd}\n")
        outfile.write("="*50 + "\n\n")

        for root, dirs, files in os.walk(cwd):
            # 무시할 폴더는 탐색하지 않도록 제거
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

            for file in files:
                if file in ignore_files:
                    continue
                
                # 이미지 파일 등은 건너뛰고 코드 파일만 수집
                if not is_text_file(file):
                    continue

                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, cwd) # 상대 경로 표시

                # 결과 파일 자체는 제외
                if file == output_filename or file == "extract.py":
                    continue

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        
                    # 구분선과 파일 경로, 내용을 씁니다.
                    outfile.write(f"\n{'='*20} START: {rel_path} {'='*20}\n")
                    outfile.write(content)
                    outfile.write(f"\n{'='*20} END: {rel_path} {'='*20}\n\n")
                    print(f"✅ 추가됨: {rel_path}")
                    
                except Exception as e:
                    print(f"⚠️ 읽기 실패 (건너뜀): {rel_path} / {e}")

    print(f"\n🎉 완료! 모든 코드가 '{output_filename}'에 저장되었습니다.")

if __name__ == "__main__":
    collect_project_code()