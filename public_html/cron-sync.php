<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');

$projectRoot = dirname(__DIR__);
$syncDir = $projectRoot . '/sync';
$dataDir = $projectRoot . '/public_html/data';
$python = $projectRoot . '/.venv/bin/python';

$expected = trim((string) @file_get_contents($syncDir . '/cron_secret.txt'));
$provided = (string) ($_GET['key'] ?? '');

if ($expected === '' || $provided === '' || !hash_equals($expected, $provided)) {
    http_response_code(403);
    exit("Forbidden\n");
}

$lock = fopen($syncDir . '/cron.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    exit("Already running\n");
}

$command = sprintf(
    '%s %s --auto --out %s 2>&1',
    escapeshellarg($python),
    escapeshellarg($syncDir . '/formadep_sync.py'),
    escapeshellarg($dataDir . '/edt.json')
);

$output = [];
$exitCode = 0;
exec($command, $output, $exitCode);
$result = implode("\n", $output) . "\n";

file_put_contents(
    $syncDir . '/cron.log',
    '[' . date('c') . '] exit=' . $exitCode . "\n" . $result . "\n",
    FILE_APPEND | LOCK_EX
);

flock($lock, LOCK_UN);
fclose($lock);

if ($exitCode !== 0) {
    http_response_code(500);
}

echo $result;
