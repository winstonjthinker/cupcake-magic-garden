from django import template
from urllib.parse import urlencode

register = template.Library()

@register.simple_tag(takes_context=True)
def url_replace(context, field, value):
    """Replace a URL parameter while keeping existing parameters."""
    request = context['request']
    query = request.GET.copy()
    query[field] = value
    return query.urlencode()
