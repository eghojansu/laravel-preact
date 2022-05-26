<?php

namespace App\Models;

use App\Extended\Model;

class Csmenu extends Model
{
    const SEPARATOR = '--sep';

    protected $fillable = array();
    protected $casts = array(
        'attrs' => 'array',
        'args' => 'array',
    );

    public function getSeparatorAttribute(): bool
    {
        return self::SEPARATOR === $this->label;
    }
}
