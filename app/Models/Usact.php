<?php

namespace App\Models;

use App\Extended\Model;

class Usact extends Model
{
    protected $fillable = array(
        'activity',
        'ip',
        'agent',
        'payload',
        'active',
    );
    protected $casts = array(
        'payload' => 'array',
    );
}
