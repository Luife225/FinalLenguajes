from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Profile

class CustomUserCreationForm(UserCreationForm):
    genero_preferido = forms.ChoiceField(
        choices=Profile._meta.get_field('genero_preferido').choices,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    plataforma_preferida = forms.ChoiceField(
        choices=Profile._meta.get_field('plataforma_preferida').choices,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    class Meta(UserCreationForm.Meta):
        model = UserCreationForm.Meta.model
        fields = UserCreationForm.Meta.fields + ('genero_preferido', 'plataforma_preferida',)
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control'}),
            'password2': forms.PasswordInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name in self.fields:
            if field_name not in ['genero_preferido', 'plataforma_preferida']:
                self.fields[field_name].widget.attrs.update({'class': 'form-control'})
