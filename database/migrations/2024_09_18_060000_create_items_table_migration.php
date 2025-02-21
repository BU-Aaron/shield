<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->nullable();
            $table->integer('position', false, true);
            $table->softDeletes();
            $table->timestamps();
            $table->timestamp('archived_at')->nullable()->default(null);

            $table->foreign('parent_id')
                ->references('id')
                ->on('items')
                ->onDelete('set null');
        });

        Schema::create('item_closure', function (Blueprint $table) {
            $table->increments('closure_id');

            $table->uuid('ancestor');
            $table->uuid('descendant');
            $table->integer('depth', false, true);

            $table->foreign('ancestor')
                ->references('id')
                ->on('items')
                ->onDelete('cascade');

            $table->foreign('descendant')
                ->references('id')
                ->on('items')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('item_closure');
        Schema::dropIfExists('items');
    }
};
