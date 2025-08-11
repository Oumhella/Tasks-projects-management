package com.projectmanager.mapper;

import com.projectmanager.dto.request.ProjectRequest;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;
import org.mapstruct.*;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ProjectMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Project toEntity(ProjectRequest request);

    @Mapping(source = "createdBy.id", target = "createdByUserId")
    @Mapping(source = "members", target = "memberIds")
    ProjectResponse toResponse(Project project);

    default Set<UUID> mapMembersToIds(Set<User> members) {
        if (members == null) {
            return null;
        }
        return members.stream()
                .map(User::getId)
                .collect(Collectors.toSet());
    }
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    void updateProjectFromDto(ProjectRequest request, @MappingTarget Project project);
}