<?php

namespace App\Models;

use App\Extended\Model;

/**
 * @property mixed $value
 */
class Cspref extends Model
{
    protected $fillable = array(
        'name',
        'content',
    );
    protected $casts = array(
        'content' => 'array',
    );

    public function getValueAttribute()
    {
        return match($this->content['type'] ?? null) {
            'int', 'integer' => intval($this->content['value'] ?? 0),
            default => $this->content['value'] ?? null,
        };
    }
}
