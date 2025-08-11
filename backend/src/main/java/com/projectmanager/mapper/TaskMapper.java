package com.projectmanager.mapper;

import com.projectmanager.dto.request.TaskRequest;
import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Task;
import org.mapstruct.*;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {CommentMapper.class, AttachmentMapper.class}
)
public interface TaskMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    Task toEntity(TaskRequest taskRequest);


    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "assignedTo.id", target = "assignedToUserId")
    @Mapping(source = "createdBy.id", target = "createdByUserId")
    TaskResponse toResponse(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    void updateTaskFromDto(TaskRequest request, @MappingTarget Task task);
}