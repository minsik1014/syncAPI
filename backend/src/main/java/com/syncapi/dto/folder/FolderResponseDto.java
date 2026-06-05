package com.syncapi.dto.folder;

import com.syncapi.model.Folder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderResponseDto {
    private String id;
    private String name;
    private String projectId;

    // Entity -> DTO 변환 메서드
    public static FolderResponseDto from(Folder folder) {
        return FolderResponseDto.builder()
                .id(folder.getId())
                .name(folder.getName())
                .projectId(folder.getProject().getId())
                .build();
    }
}
