package com.projectmanager.mapper;

import com.projectmanager.dto.request.AttachmentRequest;
import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AttachmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "comment", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "uploadedAt", ignore = true)
    Attachment toEntity(AttachmentRequest request);

    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "comment.id", target = "commentId")
    @Mapping(source = "uploadedBy.id", target = "uploadedByUserId")
    AttachmentResponse toResponse(Attachment attachment);
}