package com.syncapi.controller;

import com.syncapi.dto.folder.FolderPermissionRequestDto;
import com.syncapi.dto.folder.FolderPermissionResponseDto;
import com.syncapi.service.FolderPermissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders/permissions")
public class FolderPermissionController {

    private final FolderPermissionService permissionService;

    public FolderPermissionController(FolderPermissionService permissionService) {
        this.permissionService = permissionService;
    }

    // GET /api/folders/permissions?folderId=xxx
    @GetMapping
    public List<FolderPermissionResponseDto> getPermissions(@RequestParam String folderId) {
        return permissionService.getPermissionsByFolderId(folderId);
    }

    // POST /api/folders/permissions
    @PostMapping
    public FolderPermissionResponseDto grantPermission(@RequestBody FolderPermissionRequestDto request) {
        return permissionService.grantPermission(request);
    }

    // DELETE /api/folders/permissions/{permissionId}
    @DeleteMapping("/{permissionId}")
    public void revokePermission(@PathVariable String permissionId) {
        permissionService.revokePermission(permissionId);
    }
}
