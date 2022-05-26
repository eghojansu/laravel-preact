<?php

namespace App\Models;

use App\Extended\Model;

class Acperm extends Model
{
    const PERM_ADM_PREF = 'adm.pref';
    const PERM_ADM_USER = 'adm.user';

    protected $fillable = array(
        'permid',
        'descrip',
    );

    public function roles()
    {
        return $this->belongsToMany(
            Acrole::class,
            'acrolep',
            'permid',
            'roleid',
            'permid',
            'roleid',
        );
    }
}
