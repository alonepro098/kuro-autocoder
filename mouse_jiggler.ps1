<#
  Kuro Physical Mouse Jiggler
  Nudges the Windows OS mouse cursor slightly every 15 seconds
  to keep physical OS activity alive 100% of the time.
  Press Ctrl + C in this window to stop anytime.
#>

Add-Type -AssemblyName System.Windows.Forms
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  KURO PHYSICAL MOUSE JIGGLER RUNNING" -ForegroundColor Green
Write-Host "  Nudges OS cursor every 15s to keep active" -ForegroundColor Yellow
Write-Host "  Press Ctrl + C to exit anytime" -ForegroundColor White
Write-Host "=============================================" -ForegroundColor Cyan

while ($true) {
    $pos = [System.Windows.Forms.Cursor]::Position
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(($pos.X + 1), ($pos.Y + 1))
    Start-Sleep -Milliseconds 100
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(($pos.X), ($pos.Y))
    $now = Get-Date -Format "HH:mm:ss"
    Write-Host "[$now] Mouse active tick sent." -ForegroundColor Gray
    Start-Sleep -Seconds 15
}
