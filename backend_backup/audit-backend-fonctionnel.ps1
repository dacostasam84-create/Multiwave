# ======================================================
# audit-backend-fonctionnel.ps1
# Audit complet backend Multiwave, version corrigée
# ======================================================

# Détection automatique du dossier src
$base = "C:\Multiwave\backend\src"
if (-not (Test-Path $base)) { Write-Error "Le dossier $base n'existe pas"; return }

Write-Host "========== AUDIT BACKEND MULTIWAVE ==========" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'MM/dd/yyyy HH:mm:ss')`n"

# -------------------------------
# 1️⃣ Vérification des dossiers essentiels
# -------------------------------
$essentialDirs = @("config","controllers","middlewares","models","routes","services","sockets","uploads")
foreach ($d in $essentialDirs) {
    $path = Join-Path $base $d
    if (Test-Path $path) { Write-Host "✅ Dossier OK : $d" } 
    else { Write-Host "❌ Dossier manquant : $d" }
}

# Vérification sous-dossiers uploads
$uploadSubDirs = @("audios","videos","images","whatsapp","whispers")
$uploadsPath = Join-Path $base "uploads"
foreach ($sub in $uploadSubDirs) {
    $path = Join-Path $uploadsPath $sub
    if (-not (Test-Path $path)) { Write-Host "❌ Upload folder manquant : $sub" }
}

# -------------------------------
# 2️⃣ Vérification Controllers ↔ Routes / Services / Models
# -------------------------------
Write-Host "`n--- Vérification Controllers ↔ Routes / Services / Models ---`n"
$controllers = Get-ChildItem "$base/controllers" -Filter "*.js"
foreach ($c in $controllers) {
    $name = $c.BaseName -replace "\.controller$",""
    $routeFile = Get-ChildItem "$base/routes" -Filter "*$name*.js" -ErrorAction SilentlyContinue
    $serviceFile = Get-ChildItem "$base/services" -Filter "*$name*.js" -ErrorAction SilentlyContinue
    $modelFile = Get-ChildItem "$base/models" -Filter "*$name*.js" -ErrorAction SilentlyContinue

    Write-Host "Module: $name"
    Write-Host ("  Controller: ✓ OK")
    Write-Host ("  Route: " + (if ($routeFile) {"✓ OK"} else {"✗ MANQUANTE"}))
    Write-Host ("  Service: " + (if ($serviceFile) {"✓ OK"} else {"✗ MANQUANT"}))
    Write-Host ("  Model: " + (if ($modelFile) {"✓ OK"} else {"✗ MANQUANT"}))
}

# -------------------------------
# 3️⃣ Vérification Sockets ↔ Controllers
# -------------------------------
Write-Host "`n--- Vérification Sockets ↔ Controllers ---`n"
$sockets = Get-ChildItem "$base/sockets" -Filter "*.js"
foreach ($s in $sockets) {
    $name = $s.BaseName -replace "\.socket$",""
    $controllerFile = Get-ChildItem "$base/controllers" -Filter "*$name*.js" -ErrorAction SilentlyContinue
    if (-not $controllerFile) { Write-Host "⚠️ Socket sans controller : $name" }
}

# -------------------------------
# 4️⃣ Vérification majuscules / doublons
# -------------------------------
Write-Host "`n--- Vérification majuscules et doublons ---`n"
$allFiles = Get-ChildItem $base -Recurse -Filter "*.js"
foreach ($f in $allFiles) {
    if ($f.Name -cmatch '[A-Z]') { Write-Host "⚠️ Majuscule détectée : $($f.FullName)" }
}

Write-Host "`n==================== AUDIT TERMINÉ ====================" -ForegroundColor Cyan