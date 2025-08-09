package com.projectmanager.mapper;

import com.projectmanager.dto.request.TaskRequest;
import com.projectmanager.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TaskMapper {

//    @Mapping(target = "project", ignore = true)
    Task toEntity(TaskRequest taskRequest);

    TaskRequest toDto(Task task);

}