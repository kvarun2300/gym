import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from './Modal';
import adminService from '../../services/adminService';

const TrainerFormModal = ({ open, onClose, onSaved, trainer }) => {
  const isEdit = !!trainer;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        isEdit
          ? {
              name: trainer.user?.name,
              phone: trainer.user?.phone,
              specialization: trainer.specialization || '',
              experienceYears: trainer.experienceYears || '',
              certifications: trainer.certifications || '',
              bio: trainer.bio || '',
              salary: trainer.salary || '',
              shiftStart: trainer.shiftStart || '',
              shiftEnd: trainer.shiftEnd || '',
            }
          : {}
      );
    }
  }, [open, isEdit, trainer, reset]);

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
        await adminService.updateTrainer(trainer.id, formData);
        toast.success('Trainer updated');
      } else {
        await adminService.createTrainer(formData);
        toast.success('Trainer created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Trainer' : 'Add New Trainer'} maxWidth="max-w-2xl">
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
              <input className="input-field" placeholder="Default: Trainer@123" {...register('password')} />
            </div>
          )}
          <div>
            <label className="label-field">Specialization</label>
            <input className="input-field" placeholder="e.g. Strength & Conditioning" {...register('specialization')} />
          </div>
          <div>
            <label className="label-field">Experience (years)</label>
            <input type="number" className="input-field" {...register('experienceYears')} />
          </div>
          <div>
            <label className="label-field">Shift Start</label>
            <input type="time" className="input-field" {...register('shiftStart')} />
          </div>
          <div>
            <label className="label-field">Shift End</label>
            <input type="time" className="input-field" {...register('shiftEnd')} />
          </div>
          <div>
            <label className="label-field">Salary (₹/month)</label>
            <input type="number" className="input-field" {...register('salary')} />
          </div>
          <div>
            <label className="label-field">Profile Photo</label>
            <input type="file" accept="image/*" className="input-field file:mr-3 file:rounded-md file:border-0 file:bg-crimson/20 file:px-3 file:py-1.5 file:text-xs file:text-crimson-light" {...register('profileImage')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Certifications</label>
            <input className="input-field" placeholder="e.g. ACE-CPT, CrossFit L1" {...register('certifications')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Bio</label>
            <textarea rows={3} className="input-field resize-none" {...register('bio')} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 !py-2.5 text-xs">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-cta flex-1 !py-2.5 text-xs disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Trainer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TrainerFormModal;
