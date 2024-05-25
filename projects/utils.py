from .models import Project, Tag
from django.db.models import Q
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
import re


def paginateProjects(request, projects, results):

    page = request.GET.get('page')
    paginator = Paginator(projects, results)

    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        page = 1
        projects = paginator.page(page)
    except EmptyPage:
        page = paginator.num_pages
        projects = paginator.page(page)

    if paginator.num_pages > 10:
        leftIndex = (int(page) - 4)

        if leftIndex < 1:
            leftIndex = 1

        rightIndex = (int(page) + 5)

        if rightIndex > paginator.num_pages:
            rightIndex = paginator.num_pages + 1
    else:
        leftIndex = 1
        rightIndex = paginator.num_pages + 1

    custom_range = range(leftIndex, rightIndex)
    
    return custom_range, projects


def searchTags(request):
    tags = Tag.objects.distinct().all()

    return tags


# def searchProjects(request):
#     search_query = ''

#     if request.GET.get('search_query'):
#         search_query = request.GET.get('search_query')

#     tags = Tag.objects.filter(name__icontains=search_query)

#     projects = Project.objects.distinct(). filter(
#         Q(title__icontains=search_query) |
#         Q(description__icontains=search_query) |
#         Q(owner__name__icontains=search_query) |
#         Q(tags__in=tags)
#     )

#     return projects, search_query


def searchProjects(request):
    search_query = ''

    if request.GET.get('search_query'):
        search_query = request.GET.get('search_query').strip()

    tag_list = [tag.strip() for tag in re.split('[ ,]+', search_query) if tag.strip()]

    projects = Project.objects.distinct()
    if tag_list:
        for tag in tag_list:
            projects = projects.filter(tags__name__icontains=tag)

    # if search_query:
    #     projects = projects.filter(
    #         Q(title__icontains=search_query) |
    #         Q(description__icontains=search_query) |
    #         Q(owner__name__icontains=search_query)
    #     )

    return projects, search_query