<?php

namespace App\Http\Controllers\API;

trait API
{
    protected function json(array $data = null, string $message = null, bool $ok = true): array
    {
        return compact('ok') + array_filter(compact('message', 'data'));
    }

    protected function failed(array $data = null, string $message = null): array
    {
        return $this->json($data, $message, false);
    }
}
