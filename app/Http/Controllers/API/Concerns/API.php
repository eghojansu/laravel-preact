<?php

namespace App\Http\Controllers\API\Concerns;

trait API
{
    protected function json(array $data = null, string $message = null, bool $success = true): array
    {
        return compact('success') + array_filter(compact('message', 'data'));
    }

    protected function failed(array $data = null, string $message = null): array
    {
        return $this->json($data, $message, false);
    }
}
