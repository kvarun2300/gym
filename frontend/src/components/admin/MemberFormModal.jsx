import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from './Modal';
import adminService from '../../services/adminService';

const MemberFormModal = ({ open, onClose, onSaved, member, trainers }) => {
  const isEdit = !!member;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        isEdit
          ? {
              name: member.user?.name,
              phone: member.user?.phone,
              gender: member.gender || '',
              dateOfBirth: member.dateOfBirth || '',
              address: member.address || '',
              goal: member.goal || '',
              assignedTrainerId: member.assignedTrainerId || '',
              heightCm: member.heightCm || '',
              weightKg: member.weightKg || '',
            }
          : {}
      );
    }
  }, [open, isEdit, member, reset]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && key !== 'profileImage') {
          formData.append(key, val);
        }
      });
      if (values.profileImage?.[0]) {
        formData.append('profileImage', values.profileImage[0]);
      }

      if (isEdit) {
        await adminService.updateMember(member.id, formData);
        toast.success('Member updated');
      } else {
        await adminService.createMember(formData);
        toast.success('Member created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Member' : 'Add New Member'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name.message}</p>}
          </div>
          {!isEdit && (
            <div>
              <label className="label-field">Email</label>
              <input type="email" className="input-field" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
            </div>
          )}
          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" {...register('phone')} />
          </div>
          {!isEdit && (
            <div>
              <label className="label-field">Temp Password</label>
              <input className="input-field" placeholder="Default: Member@123" {...register('password')} />
            </div>
          )}
          <div>
            <label className="label-field">Gender</label>
            <select className="input-field" {...register('gender')}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label-field">Date of Birth</label>
            <input type="date" className="input-field" {...register('dateOfBirth')} />
          </div>
          <div>
            <label className="label-field">Height (cm)</label>
            <input type="number" step="0.1" className="input-field" {...register('heightCm')} />
          </div>
          <div>
            <label className="label-field">Weight (kg)</label>
            <input type="number" step="0.1" className="input-field" {...register('weightKg')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Address</label>
            <input className="input-field" {...register('address')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Fitness Goal</label>
            <input className="input-field" placeholder="e.g. Fat loss, muscle gain..." {...register('goal')} />
          </div>
          <div>
            <label className="label-field">Assigned Trainer</label>
            <select className="input-field" {...register('assignedTrainerId')}>
              <option value="">Unassigned</option>
              {trainers?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.user?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Profile Photo</label>
            <input type="file" accept="image/*" className="input-field file:mr-3 file:rounded-md file:border-0 file:bg-crimson/20 file:px-3 file:py-1.5 file:text-xs file:text-crimson-light" {...register('profileImage')} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 !py-2.5 text-xs">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-cta flex-1 !py-2.5 text-xs disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberFormModal;
