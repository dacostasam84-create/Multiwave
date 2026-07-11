# ==========================================================
# fix-lowercase-backend.ps1
# Renomme tous les fichiers JS en lowercase et corrige les imports
# ==========================================================

$base = "$PWD"

Write-Host "========== FIX LOWERCASE BACKEND MULTIWAVE ==========" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'MM/dd/yyyy HH:mm:ss')`n"

# -------------------------------
# 1️⃣ Liste tous les fichiers JS des dossiers principaux
# -------------------------------
$folders = @("controllers","routes","services","models","sockets")
$allFiles = foreach ($folder in $folders) {
    if (Test-Path (Join-Path $base $folder)) {
        Get-ChildItem (Join-Path $base $folder) -Recurse -Filter "*.js"
    }
}

# -------------------------------
# 2️⃣ Crée un mapping des anciens noms -> nouveaux noms lowercase
# -------------------------------
$renameMap = @{}
foreach ($f in $allFiles) {
    $oldName = $f.FullName
    $newName = Join-Path $f.DirectoryName ($f.Name.ToLower())
    if ($oldName -ne $newName) { $renameMap[$oldName] = $newName }
}

# -------------------------------
# 3️⃣ Renommer tous les fichiers
# -------------------------------
Write-Host "`n--- Renommage des fichiers ---`n"
foreach ($old in $renameMap.Keys) {
    $new = $renameMap[$old]
    try {
        Rename-Item -LiteralPath $old -NewName (Split-Path $new -Leaf) -Force
        Write-Host "✅ $old → $new"
    } catch {
        Write-Host "⚠️ Impossible de renommer $old : $_" -ForegroundColor Yellow
    }
}

# -------------------------------
# 4️⃣ Mise à jour des imports require()/import ... from
# -------------------------------
Write-Host "`n--- Mise à jour des imports ---`n"
foreach ($file in Get-ChildItem $base -Recurse -Filter "*.js") {
    $content = Get-Content $file.FullName
    $updated = $false
    for ($i = 0; $i -lt $content.Count; $i++) {
        foreach ($oldPath in $renameMap.Keys) {
            $oldFileName = Split-Path $oldPath -Leaf
            $newFileName = Split-Path $renameMap[$oldPath] -Leaf
            if ($content[$i] -match [regex]::Escape($oldFileName)) {
                $content[$i] = $content[$i] -replace [regex]::Escape($oldFileName), $newFileName
                $updated = $true
            }
        }
    }
    if ($updated) {
        Set-Content $file.FullName $content
        Write-Host "✅ Imports mis à jour dans : $($file.FullName)"
    }
}

Write-Host "`n==================== FIX TERMINÉ ====================" -ForegroundColor Cyan