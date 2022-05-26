<?php

namespace App\Models;

use App\Extended\Model;

class Usrole extends Model
{
    protected $fillable = array(
        'roleid',
        'userid',
    );
}
