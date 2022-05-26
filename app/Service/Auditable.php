<?php

namespace App\Service;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Auditable
{
    private $uniques = array();

    public function creating(Model $model): void
    {
        $class = get_class($model);
        $unique = $this->uniques[$class] ?? (
            $this->uniques[$class] = $model->getConnection()->getSchemaBuilder()->hasColumn($model->getTable(), 'uniqid')
        );

        $model->setAttribute('creby', $this->getUserId());

        if ($unique) {
            $model->setAttribute('uniqid', Str::random(8));
        }
    }

    public function saving(Model $model): void
    {
        $model->setAttribute('updby', $this->getUserId());
    }

    public function restoring(Model $model): void
    {
        $model->setAttribute('delby', null);
    }

    public function deleted(Model $model): void
    {
        $model->setAttribute('delby', $this->getUserId());

        if (
            method_exists($model, 'useSoftDeletes')
            && method_exists($model, 'silentUpdate')
            && $model->useSoftDeletes()
            && $model->isDirty()
        ) {
            $model->silentUpdate();
        }
    }

    private function getUserId(): string|null
    {
        $user = auth()->user();

        return $user instanceof User ? $user->getAttribute('userid') : null;
    }
}
