package com.projectmanager.mapper;

import com.projectmanager.dto.request.CommentRequest;
import com.projectmanager.dto.response.CommentResponse;
import com.projectmanager.entity.Comment;
import org.mapstruct.*;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {AttachmentMapper.class}
)
public interface CommentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Comment toEntity(CommentRequest request);

    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "user.id", target = "userId")
    CommentResponse toResponse(Comment comment);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(CommentRequest request, @MappingTarget Comment comment);
}
