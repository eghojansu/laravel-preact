<?php

namespace App\Models;

use App\Extended\Model;

class Usatt extends Model
{
    protected $fillable = array(
        'attleft',
        'attnext',
        'ip',
        'agent',
        'payload',
        'active',
    );
    protected $casts = array(
        'payload' => 'array',
        'attnext' => 'datetime',
    );

    public function isLocked(): bool
    {
        return $this->attnext && $this->attnext > now();
    }

    public function increase(int $max = 3, int $next = 5): bool
    {
        $this->attleft = $this->attnext ? $max - 1 : max(0, $this->attleft - 1);
        $this->attnext = 0 === $this->attleft ? now()->addMinutes($next) : (
            $this->attnext && !$this->isLocked() ? null : $this->attnext
        );

        return $this->save();
    }

    public function deactivate(): bool
    {
        $this->active = 0;

        return $this->save();
    }
}
