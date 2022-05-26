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
    );
    protected $casts = array(
        'payload' => 'array',
        'attnext' => 'datetime',
    );

    public function isLocked(): bool
    {
        return $this->attnext && $this->attnext > now();
    }

    public function increase(): bool
    {
        $this->attleft = max(0, $this->attleft - 1);
        $this->attnext = null;

        return $this->save();
    }
}
