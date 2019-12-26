import uuid
import os
import pytz
from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone
from django.conf import settings



def get_upload_path(instance, filename):
    filename = f'{uuid.uuid4()}.{filename.split(".")[-1]}'
    return os.path.join('photos', instance.type, filename)



class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email, and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_active', True)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):


    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    )


    email = models.EmailField(unique=True)
    photo = models.ImageField(upload_to=get_upload_path, null=True, help_text='cover photo', blank=True)
    gender = models.CharField(choices=GENDER_CHOICES, blank=True, null=True, max_length=6)
    country = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=False,
        help_text=_('Designates whether this user should be treated as active. '),
    )

    developer = models.BooleanField(default=False, help_text=_('Developer Skill'))
    qa = models.BooleanField(default=False, help_text=_('QA Skill'))
    bde = models.BooleanField(default=False, help_text=_('BDE Skill'))
    ba = models.BooleanField(default=False, help_text=_('BA Skill'))
    hr = models.BooleanField(default=False, help_text=_('HR Skill'))
    dob = models.DateField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    objects = UserManager()

    def __str__(self):
        return f'Email: {self.email}, Is Active: {self.is_active}'


