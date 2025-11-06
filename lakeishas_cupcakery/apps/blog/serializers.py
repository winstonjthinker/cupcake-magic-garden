# lakeishas_cupcakery/apps/blog/serializers.py
from rest_framework import serializers
from .models import BlogCategory, BlogPost, BlogComment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = fields

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'is_active']
        read_only_fields = ['slug']

class BlogPostListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    categories = BlogCategorySerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'author', 'categories',
            'featured_image', 'image_url', 'status', 'is_featured',
            'published_at', 'created_at', 'updated_at', 'comment_count'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'published_at']
    
    def get_image_url(self, obj):
        if obj.featured_image:
            return self.context['request'].build_absolute_uri(obj.featured_image.url)
        return None
    
    def get_comment_count(self, obj):
        return obj.comments.count()

class BlogPostDetailSerializer(BlogPostListSerializer):
    content = serializers.CharField()
    
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ['content']

class BlogCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = BlogComment
        fields = ['id', 'post', 'author', 'content', 'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['post', 'author', 'is_approved', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        validated_data['post_id'] = self.context['view'].kwargs.get('post_pk')
        return super().create(validated_data)