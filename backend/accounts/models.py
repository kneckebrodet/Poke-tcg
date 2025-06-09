from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    currency = models.IntegerField(default=0)
    favorite = models.CharField(max_length=100, blank=True)
    friends = models.ManyToManyField('self', blank=True)

    MEMBERSHIP_CHOICES = [
        ('FREE', 'Free'),
        ('PREMIUM', 'Premium'),
        ('VIP', 'VIP'),
    ]
    membership = models.CharField(
        max_length=10,
        choices=MEMBERSHIP_CHOICES,
        default='FREE'
    )
    is_subscribed = models.BooleanField(default=False)
    membership_expiration_date = models.DateField(null=True, blank=True)

    def has_valid_membership(self):
        if not self.is_subscribed or not self.membership_expiration_date:
            return False
        return self.membership_expiration_date >= timezone.now().date()

    def __str__(self):
        return (
            f"Username: {self.username}, "
            f"Membership: {self.membership}, "
            f"Subscribed: {self.is_subscribed}, "
            f"Favorite: {self.favorite}"
        )
