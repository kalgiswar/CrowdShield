# Start Backend Session Service
Write-Host "Starting Backend Session Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\kalgi\OneDrive\Desktop\CrowdShield-main\backend\session'; python main.py"
Write-Host "Backend Session Service Started."
