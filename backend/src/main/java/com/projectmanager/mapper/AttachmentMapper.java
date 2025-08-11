package com.projectmanager.mapper;

import com.projectmanager.dto.request.AttachmentRequest;
import com.projectmanager.dto.response.AttachmentResponse;
import com.projectmanager.entity.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AttachmentMapper {


    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "comment.id", target = "commentId")
    @Mapping(source = "uploadedBy.id", target = "uploadedByUserId")
    AttachmentResponse toResponse(Attachment attachment);

    List<AttachmentResponse> toResponseList(List<Attachment> attachments);
}