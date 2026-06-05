package com.syncapi.dto.folder;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FolderRequestDto {
    private String name;
    private String projectId; // 어느 프로젝트에 폴더를 만들지 알아야 함
}
