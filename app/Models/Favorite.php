<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/** 
 * Classe alterada para supostamente suportar composite primary keys (chaves primárias compostas).
 * O Eloquent não suporta isso, por isso temos que modificar os métodos relacionados ao query builder.
 * Mais infos em: 
 *  - https://blog.maqe.com/solved-eloquent-doesnt-support-composite-primary-keys-62b740120f
 *  - https://laracasts.com/discuss/channels/general-discussion/how-to-reference-composite-key-in-models
 */

class Favorite extends Model
{
    protected $primaryKey = ['id_user', 'id_quest'];

    public $incrementing = false;

    protected function getKeyForSaveQuery()
    {

        $primaryKeyForSaveQuery = array(count($this->primaryKey));

        foreach ($this->primaryKey as $i => $pKey) {
            $primaryKeyForSaveQuery[$i] = isset($this->original[$this->getKeyName()[$i]])
                ? $this->original[$this->getKeyName()[$i]]
                : $this->getAttribute($this->getKeyName()[$i]);
        }

        return $primaryKeyForSaveQuery;

    }

    /**
     * Set the keys for a save update query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery(Builder $query)
    {

        foreach ($this->primaryKey as $i => $pKey) {
            $query->where($this->getKeyName()[$i], '=', $this->getKeyForSaveQuery()[$i]);
        }

        return $query;
    }
    use HasFactory;
}
