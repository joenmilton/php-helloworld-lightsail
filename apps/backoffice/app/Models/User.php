<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\otpGrant\HasOTP;
use Illuminate\Support\Str;
use Auth;

class User extends Authenticatable
{
    use HasApiTokens, HasOTP, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $dates = ['deleted_at'];
    
    protected $appends = ['is_manager', 'profile_pic', 'temp_custom_fields'];
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'country_code',
        'mobile',
        'password',
        'is_superadmin',
        'owner_id',
        'whatsapp',
        'referral_code',
        'referred_by',
        'source_type',
        'phone_verified'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected static function boot() {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->referral_code)) {
                $user->referral_code = $user->generateReferralCode();
            }
        });
    }

    private static function generateReferralCode() {
        do {
            $code = Str::upper(Str::random(8));
        } while (self::where('referral_code', $code)->exists());

        return $code;
    }

    public function internal_references() {
        return $this->hasMany(InternalReference::class, 'contact_id');
    }
    
    public function latestOtp() {
        return $this->hasOne(UserOtp::class, 'user_id')->latestOfMany();
    }

    public function findForPassport(string $username): User {
        return $this->where('email', $username)->first();
    }

    public function getPermissionNames() {

        if ($this->hasRole('admin')) {
            return Permission::pluck('name');
        }

        return $this->getAllPermissions()->pluck('name');
    }



    public function getProfilePicAttribute() {
        return asset('storage/contact.png');
    }

    public function customFields() {
        return $this->morphMany(CustomField::class, 'model');
    }

    public function getTempCustomFieldsAttribute(){
        return $this->customFields;
    }

    public function teams() {
        return $this->belongsToMany(Team::class, 'team_users', 'user_id', 'team_id')
            ->withPivot('is_manager');
    }

    public function managedTeams() {
        return $this->teams()->wherePivot('is_manager', true);
    }

    public function getIsManagerAttribute() {
        return $this->pivot ? $this->pivot->is_manager : null;
    }



    public static function getBackendUsers() {

        $query = self::query();

        $query->doesntHave('roles', 'and', function($query) {
            $query->where('name', 'user');
        });

        return $query;
    }

    public function scopeGetVisibleClients($query) {
        $query->role('user')
            ->whereNull('users.deleted_at');

        $user = Auth::user();
        if ($user->hasRole('admin')) {
            return $query;
        }

        if ($user->can('attach all client')) {
            return $query;
        }

        $query->where(function ($q) use ($user) {
            if ($user->can('attach own client')) {
                $q->Where('users.owner_id', $user->id);
            }
        });

        return $query;
    }










    public function notificationReadStatuses() {
        return $this->hasMany(NotificationReadStatus::class);
    }
    
    public function notifications() {
        return Notification::where(function($query) {
            // Single or group notifications where user is in target_ids
            $query->whereJsonContains('target_ids', $this->id);
            
            // All users notifications for application users
            if ($this->hasRole('user')) {
                $query->orWhere('target_type', 'all_users');
            }
            
            // All management notifications for management users
            if (!$this->hasRole('user')) {
                $query->orWhere('target_type', 'all_management');
            }
        });
    }
    
    public function unreadNotifications() {
        return $this->notifications()
            ->whereDoesntHave('readStatuses', function($query) {
                $query->where('user_id', $this->id);
            });
    }


}
