import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save, KeyRound } from 'lucide-react';
import trainerService from '../../services/trainerService';
import ScrollReveal from '../../components/common/ScrollReveal';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { setTitle } = useOutletContext();
  const { user, setUser } = useAuth();
  const profileForm = useForm({ defaultValues: { name: user?.name, phone: user?.phone || '' } });
  const passwordForm = useForm();

  useEffect(() => setTitle('My Profile'), [setTitle]);

  const onSaveProfile = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.phone) formData.append('phone', values.phone);
      if (values.profileImage?.[0]) formData.append('profileImage', values.profileImage[0]);

      const { data } = await trainerService.updateProfile(formData);
      setUser(data.data.user);
      localStorage.setItem('xf_user', JSON.stringify(data.data.user));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    }
  };

  const onChangePassword = async (values) => {
    try {
      await trainerService.changePassword(values);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ScrollReveal>
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="glass space-y-5 p-7">
          <h3 className="font-display text-base font-bold text-white">Personal Details</h3>

          <div className="flex items-center gap-4">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-crimson/15 font-display text-xl font-bold text-crimson-light">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <label className="label-field">Update Photo</label>
              <input
                type="file"
                accept="image/*"
                className="input-field file:mr-3 file:rounded-md file:border-0 file:bg-crimson/20 file:px-3 file:py-1.5 file:text-xs file:text-crimson-light"
                {...profileForm.register('profileImage')}
              />
            </div>
          </div>

          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" {...profileForm.register('name', { required: 'Name is required' })} />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input className="input-field opacity-60" value={user?.email} disabled />
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" {...profileForm.register('phone')} />
          </div>

          <button type="submit" disabled={profileForm.formState.isSubmitting} className="btn-cta !py-2.5 text-xs disabled:opacity-60">
            <Save size={15} /> Save Changes
          </button>
        </form>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="glass space-y-5 p-7">
          <h3 className="font-display text-base font-bold text-white">Change Password</h3>

          <div>
            <label className="label-field">Current Password</label>
            <input
              type="password"
              className="input-field"
              {...passwordForm.register('currentPassword', { required: 'Required' })}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1.5 text-xs text-danger">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="label-field">New Password</label>
            <input
              type="password"
              className="input-field"
              {...passwordForm.register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1.5 text-xs text-danger">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>

          <button type="submit" disabled={passwordForm.formState.isSubmitting} className="btn-ghost !py-2.5 text-xs disabled:opacity-60">
            <KeyRound size={15} /> Update Password
          </button>
        </form>
      </ScrollReveal>
    </div>
  );
};

export default Profile;
