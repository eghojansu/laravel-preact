<?php

namespace App\Extension;

use App\Models\User;
use App\Service\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait AuditableTrait
{
    public static function bootAuditableTrait(): void
    {
        static::observe(app(Auditable::class));
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creby', 'userid');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updby', 'userid');
    }

    public function scopeCreatedBy(Builder $builder, $user): Builder
    {
        $userid = $user instanceof Model ? $user->getAttribute('userid') : $user;

        return $builder->where($this->getTable() . '.creby', $userid);
    }

    public function scopeUpdatedBy(Builder $builder, $user): Builder
    {
        $userid = $user instanceof Model ? $user->getAttribute('userid') : $user;

        return $builder->where($this->getTable() . '.updby', $userid);
    }

    public function silentUpdate(): int
    {
        return $this->newQueryWithoutScopes()
            ->where($this->getKeyName(), $this->getKey())
            ->getQuery()
            ->update($this->getDirty());
    }

    public function useSoftDeletes(): bool
    {
        return in_array(SoftDeletes::class, class_uses_recursive($this), true);
    }
}
