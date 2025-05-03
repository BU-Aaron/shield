<?php

namespace Database\Seeders;

use Modules\User\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Workspace\Actions\CreateWorkspaceAction;
use Modules\Workspace\Data\CreateWorkspaceData;
use Modules\Folder\Actions\CreateFolderAction;
use Modules\Folder\Data\CreateFolderData;
use Modules\Metadata\Models\Metadata;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            SecurityQuestionSeeder::class,
        ]);

        $testUser1 = User::create([
            'name' => 'Admin',
            'email' => 'admin@email.com',
            'username' => 'admin',
            'password' => Hash::make('12345678'),
            'office_position' => 'Admin Staff',
            'workflow_role' => 'reviewer',
            'system_role' => 'admin',
            'security_question_id' => 1,
            'security_question_answer' => Hash::make('wasabi'),
        ]);

        $testUser1->assignRole('admin');

        // Create System Metadata
        Metadata::create([
            'name' => 'Document Number',
            'type' => 'Text',
            'status' => 'system',
        ]);


        // Create Custom Metadata
        Metadata::create([
            'name' => 'Country',
            'type' => 'Text',
            'status' => 'custom',
        ]);

        Metadata::create([
            'name' => 'Published Year',
            'type' => 'Number',
            'status' => 'custom',
        ]);

        Metadata::create([
            'name' => 'Nature of Crime',
            'type' => 'Text',
            'status' => 'custom',
        ]);


        // Create Workspace through folder
        $createWorkspaceAction = app(CreateWorkspaceAction::class);
        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Administrative',
            owned_by: $testUser1->id
        ));

        $workspace2 = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Digital Forensics',
            owned_by: $testUser1->id
        ));

        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Supply',
            owned_by: $testUser1->id
        ));

        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Case Folders',
            owned_by: $testUser1->id
        ));

        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Memorandums',
            owned_by: $testUser1->id
        ));
    }
}
