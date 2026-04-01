#!/usr/bin/env php
<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$styleFile = $root . '/style.css';
$changelogFile = $root . '/CHANGELOG.md';

if ($argc < 3) {
    fwrite(STDERR, "Usage: php scripts/prepare-release.php <version> <release-date>\n");
    exit(1);
}

$version = trim($argv[1]);
$releaseDate = trim($argv[2]);

if (!preg_match('/^\d+\.\d+\.\d+$/', $version)) {
    fwrite(STDERR, "Version must use semantic format like 1.0.2\n");
    exit(1);
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $releaseDate)) {
    fwrite(STDERR, "Release date must use YYYY-MM-DD\n");
    exit(1);
}

$style = file_get_contents($styleFile);

if ($style === false) {
    fwrite(STDERR, "Could not read style.css\n");
    exit(1);
}

$updatedStyle = preg_replace(
    '/^Version:\s*.+$/m',
    'Version: ' . $version,
    $style,
    1,
    $styleReplacements
);

if ($updatedStyle === null || $styleReplacements !== 1) {
    fwrite(STDERR, "Could not update Version header in style.css\n");
    exit(1);
}

if (file_put_contents($styleFile, $updatedStyle) === false) {
    fwrite(STDERR, "Could not write style.css\n");
    exit(1);
}

$changelog = file_get_contents($changelogFile);

if ($changelog === false) {
    fwrite(STDERR, "Could not read CHANGELOG.md\n");
    exit(1);
}

$releaseHeading = '## ' . $version . ' - ' . $releaseDate;

if (strpos($changelog, $releaseHeading) !== false) {
    fwrite(STDERR, "CHANGELOG.md already contains an entry for {$releaseHeading}\n");
    exit(1);
}

$entry = $releaseHeading . "\n"
    . "### Added\n"
    . "- \n\n"
    . "### Changed\n"
    . "- \n\n"
    . "### Fixed\n"
    . "- \n\n"
    . "### Notes\n"
    . "- \n\n";

$updatedChangelog = preg_replace(
    '/^(This project uses a simple release format:\n(?:- .+\n)+\n)/m',
    '$1' . $entry,
    $changelog,
    1,
    $changelogReplacements
);

if ($updatedChangelog === null || $changelogReplacements !== 1) {
    fwrite(STDERR, "Could not insert release template into CHANGELOG.md\n");
    exit(1);
}

if (file_put_contents($changelogFile, $updatedChangelog) === false) {
    fwrite(STDERR, "Could not write CHANGELOG.md\n");
    exit(1);
}

fwrite(STDOUT, "Prepared release {$version} dated {$releaseDate}\n");
