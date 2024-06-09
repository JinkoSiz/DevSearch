from django.db.models.signals import post_save, post_delete
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import Profile


def createProfile(sender, instance, created, **kwargs):
    if created:
        user = instance
        profile = Profile.objects.create(
            user=user,
            username=user.username,
            name=user.first_name,
        )

        subject = f'{profile.username}, Welcome to DevSearch!'
        message = '''
        Welcome to DevSearch!

        We aim to help people all over the world find a job in CS by creating portfolio and putting it directly into practice.
        We are delighted to welcome you and hope you will enjoy your experience!
        '''

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            fail_silently=False
        )
    

def updateUser(sender, instance, created, **kwargs):
    profile = instance
    user = profile.user

    if created == False:
        user.first_name = profile.name
        user.username = profile.username
        user.save()


def deleteUser(sender, instance, **kwargs):
    try:
        user = instance.user
        user.delete()
    except:
        pass


post_save.connect(createProfile, sender=User)
post_save.connect(updateUser, sender=Profile)
post_delete.connect(deleteUser, sender=Profile)
