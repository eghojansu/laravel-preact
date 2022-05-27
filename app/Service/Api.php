<?php

namespace App\Service;

class Api
{
    public function json(
        string $message = null,
        \JsonSerializable|array $data = null,
        bool $success = true,
    ): array {
        return compact('success') + array_filter(compact('message', 'data'));
    }

    public function ok(string $message = null, \JsonSerializable|array $data = null): array
    {
        return $this->json(trans($message ?? 'OK'), $data);
    }

    public function fail(string $message = null, \JsonSerializable|array $data = null): array
    {
        return $this->json(trans($message ?? 'Failed'), $data, false);
    }

    public function data(\JsonSerializable|array $data = null, string $message = null): array
    {
        return $this->json(trans($message ?? ''), $data);
    }

    public function saved(\JsonSerializable|array $data = null): array
    {
        return $this->json(trans('data.saved'), $data);
    }

    public function updated(\JsonSerializable|array $data = null): array
    {
        return $this->json(trans('data.updated'), $data);
    }

    public function restored(\JsonSerializable|array $data = null): array
    {
        return $this->json(trans('data.restored'), $data);
    }

    public function deleted(\JsonSerializable|array $data = null): array
    {
        return $this->json(trans('data.deleted'), $data);
    }
}
