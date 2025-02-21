<?php

namespace Database\Seeders;

use Modules\User\Models\User;
use Illuminate\Database\Seeder;
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
        ]);

        //TODO: workflow roles have unassigned, reviewer, approver

        // Developer
        $testUser1 = User::create([
            'name' => 'John Alfred Alfonso',
            'email' => 'johnalfredalfonso12@gmail.com',
            'password' => '12345678',
            'office_position' => 'Admin Staff',
            'workflow_role' => 'reviewer',
            'system_role' => 'admin',
        ]);

        // Director
        $testUser2 = User::create([
            'name' => 'Angelo Alteza',
            'email' => 'emmanuelangelocanares.alteza@bicol-u.edu.ph',
            'password' => '12345678',
            'office_position' => 'Director',
            'workflow_role' => 'approver',
            'system_role' => 'viewer',
        ]);

        // Admin Staff
        $testUser3 = User::create([
            'name' => 'Mark Elthon Jay Omanga',
            'email' => 'markelthonjaymanoza.omanga@bicol-u.edu.ph',
            'password' => '12345678',
            'office_position' => 'Admin Staff',
            'workflow_role' => 'unassigned',
            'system_role' => 'viewer',
        ]);

        // Coordinator
        $testUser4 = User::create([
            'name' => 'Geryme Mendez',
            'email' => 'gerymeacuna.mendez@bicol-u.edu.ph',
            'password' => '12345678',
            'office_position' => 'Coordinator',
            'workflow_role' => 'reviewer',
            'system_role' => 'none',
        ]);

        // Coordinator
        $testUser5 = User::create([
            'name' => 'John Carlo Abillano',
            'email' => 'johncarlobutlig.abillano@bicol-u.edu.ph',
            'password' => '12345678',
            'office_position' => 'Coordinator',
            'workflow_role' => 'reviewer',
            'system_role' => 'viewer',
        ]);

        $testUser1->assignRole('admin');
        $testUser2->assignRole('viewer');
        $testUser3->assignRole('viewer');
        $testUser4->assignRole('none');
        $testUser5->assignRole('viewer');

        // Create System Metadata
        Metadata::create([
            'name' => 'Document Number',
            'type' => 'Text',
            'status' => 'system',
        ]);

        Metadata::create([
            'name' => 'Due In',
            'type' => 'Date',
            'status' => 'system',
        ]);

        Metadata::create([
            'name' => 'Review Status',
            'type' => 'Text',
            'status' => 'system',
        ]);

        Metadata::create([
            'name' => 'Approval Status',
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

        // Metadata::create([
        //     'name' => 'Is Confidential',
        //     'type' => 'boolean',
        //     'status' => 'custom',
        // ]);

        Metadata::create([
            'name' => 'Subject',
            'type' => 'Text',
            'status' => 'custom',
        ]);

        Metadata::create([
            'name' => 'For',
            'type' => 'Text',
            'status' => 'custom',
        ]);

        Metadata::create([
            'name' => 'Thru',
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
            name: 'Applications',
            owned_by: $testUser1->id
        ));

        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Services',
            owned_by: $testUser1->id
        ));

        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Partnerships',
            owned_by: $testUser1->id
        ));

        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Memorandums',
            owned_by: $testUser1->id
        ));

        // Create Folder
        $createFolderAction = app(CreateFolderAction::class);
        $folder1 = $createFolderAction->execute(new CreateFolderData(
            parent_id: $workspace2->item_id,
            name: 'Student Inbound',
            owned_by: $testUser1->id
        ));

        $folder2 = $createFolderAction->execute(new CreateFolderData(
            parent_id: $workspace2->item_id,
            name: 'Student Outbound',
            owned_by: $testUser1->id
        ));

        $folder3 = $createFolderAction->execute(new CreateFolderData(
            parent_id: $folder2->item_id,
            name: 'Belgium 2024',
            owned_by: $testUser1->id
        ));

        $folder4 = $createFolderAction->execute(new CreateFolderData(
            parent_id: $folder3->item_id,
            name: 'John Doe',
            owned_by: $testUser1->id
        ));

        $folder5 = $createFolderAction->execute(new CreateFolderData(
            parent_id: $folder3->item_id,
            name: 'Mary Jane',
            owned_by: $testUser1->id
        ));
    }
}
